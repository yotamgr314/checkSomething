const setFetchPostOrPutRequestDetails = (method, body) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    return {
        method,
        headers,
        credentials: 'include',
        body: JSON.stringify(body)
    }
}

const setFetchGetOrDeleteRequestDetails = (method) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    return {
        method,
        headers,
        credentials: 'include',
    }
}

export { setFetchPostOrPutRequestDetails, setFetchGetOrDeleteRequestDetails };
