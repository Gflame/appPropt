/// actions/user.js

export function login(username, password) {
    return (dispatch) => {

        // We use this to update the store state of `isLoggingIn`
        // which can be used to display an activity indicator on the login
        // view.
        dispatch(loginRequest())

        // Note: This base64 encode method only works in NodeJS, so use an
        // implementation that works for your platform:
        // `base64-js` for React Native,
        // `btoa()` for browsers, etc...
        //const hash = new Buffer(`${username}:${password}`).toString('base64')
        return fetch('https://httpbin.org/basic-auth/admin/secret', {
            headers: {
                'Authorization': `Basic ${hash}`
            }
        })
            .then(response => response.json().then(json => ({ json, response })))
            .then(({json, response}) => {
                if (response.ok === false) {
                    return Promise.reject(json)
                }
                return json
            })
            .then(
                data => {
                    // data = { authenticated: true, user: 'admin' }
                    // We pass the `authentication hash` down to the reducer so that it
                    // can be used in subsequent API requests.

                    dispatch(loginSuccess(hash, data.user))
                },
                (data) => dispatch(loginFailure(data.error || 'Log in failed'))
            )
    }
}