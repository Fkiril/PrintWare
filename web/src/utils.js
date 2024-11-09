const handleResponseError = (error, navigateFunc) => {
    return navigateFunc('/error', {
        state: {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
        }
    })
}

export { handleResponseError };