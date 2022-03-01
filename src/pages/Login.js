import axios from "axios";
import React from "react";
import { authorization, baseUrl } from "../config";

class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: ""
        }
    }

    loginProcess(event) {
        event.preventDefault()

        let endpoint = `${baseUrl}/auth`

        let data = {
            username: this.state.username,
            password: this.state.password
        }

        axios.post(endpoint, data, authorization)
            .then(result => {
                if (result.data.logged) {
                    // store token in local storage
                    localStorage.setItem("token", result.data.token)
                    localStorage.setItem("user", JSON.stringify(result.data.user))
                    window.alert("Login Success!")
                    window.location.href = "/Member"
                } else {
                    window.alert("Check ur username and password again!")
                }
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <div className="container">
                <div className="col-lg-6" style={{ margin: "0 auto" }}>
                    <div className="card">
                        <div className="card-header bg-primary">
                            <h4 className="text-white">Login</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={ev => this.loginProcess(ev)}>
                                Username
                                <input type="text" className="form-control mb-2" required value={this.state.username}
                                    onChange={ev => this.setState({ username: ev.target.value })} />

                                Password
                                <input type="password" className="form-control mb-2" required value={this.state.password}
                                    onChange={ev => this.setState({ password: ev.target.value })} />

                                <button type="submit" className="btn btn-login btn-primary">
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;