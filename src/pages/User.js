import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { authorization, baseUrl } from "../config";

class User extends React.Component {
    constructor() {
        super();
        this.state = {
            id_user: "",
            nama: "",
            username: "",
            password: "",
            role: "",
            action: "",
            users: [
                {
                    id_user: "1", nama: "phoebe", username: "phoebethegoat", password: "phoebe123", role: "admin"
                },
                {
                    id_user: "2", nama: "rick", username: "rickomorty", password: "rick123", role: "admin"
                },
                {
                    id_user: "3", nama: "keita", username: "nabykeita", password: "keita123", role: "admin"
                }
            ]
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData() {
        this.modalUser = new Modal(document.getElementById("modal_user"));
        this.modalUser.show()

        this.setState({
            action: "tambah",
            id_user: Math.random(1, 10000),
            nama: "",
            username: "",
            password: "",
            role: ""
        })
    }

    simpanData(event) {
        event.preventDefault();

        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/users`

            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role
            }

            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            this.modalUser.hide(0)
        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/users/` + this.state.id_user

            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role
            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            this.modalUser.hide()
        }
    }

    ubahData(id_user) {
        this.modalUser = new Modal(document.getElementById("modal_user"));
        this.modalUser.show()

        let index = this.state.users.findIndex(
            user => user.id_user === id_user
        )

        this.setState({
            action: "ubah",
            id_user: id_user,
            nama: this.state.users[index].nama,
            username: this.state.users[index].username,
            password: this.state.users[index].password,
            role: this.state.users[index].role,
        })
    }

    hapusData(id_user) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini")) {
            let endpoint = `${baseUrl}/users/` + id_user

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    getData() {
        let endpoint = `${baseUrl}/users`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ users: response.data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getData()

        let user = JSON.parse(localStorage.getItem("user"))
        if (user.role === 'admin') {
            this.setState({
                visible: true
            })
        } else {
            this.setState({
                visible: false
            })
        }
    }


    render() {
        return (
            <div className="container">
                <div className="card">
                    <div className="card-header bg-secondary">
                        <h4 className="text-white">
                            List of User
                        </h4>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.users.map(user => (
                                <div className="list-group-item">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <small className="text-secondary">Name</small>
                                            <br />
                                            <h6>{user.nama}</h6>
                                        </div>

                                        <div className="col-lg-3">
                                            <small className="text-secondary">Username</small>
                                            <br />
                                            <h6>{user.username}</h6>
                                        </div>

                                        <div className="col-lg-3">
                                            <small className="text-secondary">Role</small>
                                            <br />
                                            <h6>{user.role}</h6>
                                        </div>

                                        <div className="col-lg-2 justify-content-center align-self-center">
                                            <button className={`btn btn-sm btn-warning mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.ubahData(user.id_user)}>
                                                Edit
                                            </button>

                                            <button className={`btn btn-sm btn-danger mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.hapusData(user.id_user)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ul>
                        <button className={`btn btn-success my-2 ${this.state.visible ? `` : `d-none`}`}
                            onClick={() => this.tambahData()}>
                            Add new user
                        </button>
                    </div>
                </div>

                {/* form modal add new user */}
                <div className="modal fade" id="modal_user">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header bg-success">
                                <h4 className="text-white">
                                    Form data user
                                </h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={ev => this.simpanData(ev)}>
                                    Name
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.nama} onChange={ev => this.setState({ nama: ev.target.value })} />

                                    Username
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} />

                                    Password
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.password} onChange={ev => this.setState({ password: ev.target.value })} />

                                    Role
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.role} onChange={ev => this.setState({ role: ev.target.value })} />

                                    <button className="btn btn-success" type="submit">
                                        Save
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default User;