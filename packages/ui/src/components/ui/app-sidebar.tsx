import type * as React from 'react'
import { type RefObject, useRef } from 'react'
import { useProximityHover, useRegisterProximityItem } from '../../hooks/use-proximity-hover'
import { cn } from '../../lib/cn'
import { Button } from './button'
import { DragRegion, NoDrag } from './drag-region'
import { ImageWithPlaceholder } from './image-with-placeholder'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { TravelingHighlight } from './traveling-highlight'

interface AppSidebarIcon {
  active: React.ComponentType<{ className?: string }>
  inactive: React.ComponentType<{ className?: string }>
}

interface AppSidebarItem {
  id: string
  label: string
  icon: AppSidebarIcon
  avatar?: { src: string | null; name: string }
  active?: boolean
  disabled?: boolean
  indicator?: boolean
  showLabel?: boolean
  showTooltip?: boolean
  onClick?: () => void
}

interface AppSidebarProps {
  appName?: string
  logoSrc?: string
  logoAlt?: string
  className?: string
  items: AppSidebarItem[]
  bottomItems?: AppSidebarItem[]
}

interface SidebarNavGroupProps {
  items: AppSidebarItem[]
}

interface SidebarNavItemProps {
  item: AppSidebarItem
  index: number
  hovered: boolean
  registerItem: (index: number, element: HTMLElement | null) => void
}

/**
 * Render one icon-rail button, registering it with the traveling highlight.
 *
 * @param props.item Sidebar destination or action.
 * @param props.index Index of the item inside its nav group.
 * @param props.hovered Whether the pointer is nearest this item.
 * @param props.registerItem Proximity-hover registration callback.
 */
function SidebarNavItem({ item, index, hovered, registerItem }: SidebarNavItemProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isActive = Boolean(item.active)
  const IconComponent = isActive || hovered ? item.icon.active : item.icon.inactive

  useRegisterProximityItem(registerItem, index, buttonRef as RefObject<HTMLElement | null>)

  const button = (
    <Button
      aria-label={item.label}
      className={cn(
        'relative z-10 h-11 w-11 justify-center gap-3 rounded-xl px-0 hover:bg-transparent hover:text-inherit sm:w-full sm:justify-start sm:px-3',
        isActive && 'text-primary'
      )}
      data-proximity-index={index}
      disabled={item.disabled}
      onClick={item.onClick}
      ref={buttonRef}
      size="default"
      variant="ghost"
    >
      {item.avatar ? (
        <ImageWithPlaceholder
          alt={item.avatar.name}
          className="h-8 w-8 overflow-hidden rounded-full"
          fallbackIcon={<IconComponent className="h-5! w-5!" />}
          imgClassName="h-full w-full object-cover"
          key={item.avatar.src}
          src={item.avatar.src ?? undefined}
        />
      ) : (
        <IconComponent className={cn('h-5! w-5!', isActive && 'text-primary')} />
      )}
      <span className="hidden truncate font-medium text-sm sm:inline">{item.label}</span>
      {item.indicator ? (
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
      ) : null}
    </Button>
  )

  return (
    <div className="flex w-full flex-col items-center gap-1">
      {item.showTooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        button
      )}
    </div>
  )
}

/**
 * Render a cluster of rail items that share one traveling highlight.
 *
 * @param props.items Items in this cluster (top destinations or bottom actions).
 */
function SidebarNavGroup({ items }: SidebarNavGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedIndex = items.findIndex((item) => item.active)
  const {
    activeIndex: hoveredIndex,
    itemRects,
    isMeasured,
    sessionRef,
    handlers,
    registerItem
  } = useProximityHover(containerRef)

  if (items.length === 0) {
    return null
  }

  return (
    <NoDrag
      className="relative flex w-full flex-col items-center gap-1 px-2 sm:px-3"
      data-slot="sidebar-nav-group"
      ref={containerRef}
      {...handlers}
    >
      <TravelingHighlight
        hoveredIndex={hoveredIndex}
        isMeasured={isMeasured}
        itemRects={itemRects}
        selectedIndex={selectedIndex >= 0 ? selectedIndex : null}
        sessionRef={sessionRef}
        shapeClassName="rounded-xl"
      />
      {items.map((item, index) => (
        <SidebarNavItem
          hovered={hoveredIndex === index}
          index={index}
          item={item}
          key={item.id}
          registerItem={registerItem}
        />
      ))}
    </NoDrag>
  )
}

/**
 * Render the shared app icon rail used by desktop and web.
 *
 * @param props.appName Product name under the logo.
 * @param props.logoSrc Logo image URL.
 * @param props.logoAlt Logo alt text.
 * @param props.className Extra classes for the rail.
 * @param props.items Primary destinations.
 * @param props.bottomItems Footer actions such as settings and about.
 */
export function AppSidebar({
  appName = 'App',
  logoSrc = './app-icon.png',
  logoAlt = 'App icon',
  className,
  items,
  bottomItems = []
}: AppSidebarProps) {
  return (
    <DragRegion
      asChild
      className={cn(
        'flex w-16 min-w-16 max-w-16 flex-col items-center gap-4 border-border/70 border-r bg-sidebar py-4 sm:w-56 sm:min-w-56 sm:max-w-56',
        className
      )}
    >
      <aside>
        <div className="mt-4 flex w-full items-center justify-center gap-3 px-3 py-3 sm:justify-start">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center">
            <img alt={logoAlt} className="h-10 w-10" src={logoSrc} />
          </div>
          <span className="hidden text-left font-bold text-sidebar-foreground text-sm leading-tight sm:block">
            {appName}
          </span>
        </div>

        <SidebarNavGroup items={items} />

        <div className="flex-1" />

        <SidebarNavGroup items={bottomItems} />
      </aside>
    </DragRegion>
  )
}

export type { AppSidebarIcon, AppSidebarItem, AppSidebarProps }
