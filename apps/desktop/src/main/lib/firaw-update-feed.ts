export const firawUpdateFeedUrl = process.env.FIRAW_UPDATE_URL?.trim() ?? ''

export const isFirawUpdateConfigured = firawUpdateFeedUrl.length > 0
