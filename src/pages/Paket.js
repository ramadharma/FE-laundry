import { Modal } from "bootstrap";
import React from "react";
import axios from "axios";
import { authorization, baseUrl } from "../config";

class Paket extends React.Component {
    constructor() {
        super();
        this.state = {
            id_paket: "",
            jenis_paket: "",
            harga: "",
            action: "",
            pakets: [
                {
                    id_paket: "1", jenis_paket: "Baju", harga: 5000
                },
                {
                    id_paket: "2", jenis_paket: "Sprei", harga: 7000
                },
                {
                    id_paket: "3", jenis_paket: "Selimut", harga: 7000
                }
            ]
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData() {
        this.modalPaket = new Modal(document.getElementById("modal_paket"));
        this.modalPaket.show() // menampilkan modal
        // reset state untuk form Paket
        this.setState({
            action: "tambah",
            id_paket: 0,
            jenis_paket: "",
            harga: 0
        })
    }

    simpanData(event) {
        event.preventDefault();

        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/paket`
            // tampung data
            let data = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga
            }

            // // tambah ke state pakets
            // let temp = this.state.pakets;
            // temp.push(data); // menambah data pada array
            // this.setState({ pakets: temp });

            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            this.modalPaket.hide();
        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/paket/` + this.state.id_paket

            let data = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga
            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // let temp = this.state.pakets;
            // let index = temp.findIndex(
            //     paket => paket.id_paket === this.state.id_paket
            // )

            // temp[index].jenis_paket = this.state.jenis_paket;
            // temp[index].harga = this.state.harga;

            // this.setState({ pakets: temp });
            this.modalPaket.hide();
        }
    }

    ubahData(id_paket) {
        this.modalPaket = new Modal(document.getElementById("modal_paket"));
        this.modalPaket.show();

        let index = this.state.pakets.findIndex(
            paket => paket.id_paket === id_paket
        );

        this.setState({
            action: "ubah",
            id_paket: id_paket,
            jenis_paket: this.state.pakets[index].jenis_paket,
            harga: this.state.pakets[index].harga
        })
    }

    hapusData(id_paket) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
            let endpoint = `${baseUrl}/paket/` + id_paket

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // mencari posisi index
            let temp = this.state.pakets;
            let index = temp.findIndex(
                paket => [paket.id_paket === id_paket]
            )

            // hapus data
            temp.splice(index, 1)

            this.setState({ pakets: temp })
        }
    }

    getData() {
        let endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ pakets: response.data })
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
                            List of Paket
                        </h4>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.pakets.map(paket => (
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-lg-5">
                                            <small className="text-secondary">Package Type</small>
                                            <br />
                                            <h6>{paket.jenis_paket}</h6>
                                        </div>
                                        <div className="col-lg-5">
                                            <small className="text-secondary">Price</small>
                                            <br />
                                            <h6>{paket.harga}</h6>
                                        </div>
                                        <div className="col-lg-2 justify-content-center align-self-center">
                                            <button className={`btn btn-sm btn-warning mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.ubahData(paket.id_paket)}>
                                                Edit
                                            </button>

                                            <button className={`btn btn-sm btn-danger mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.hapusData(paket.id_paket)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button className={`btn btn-success my-2 ${this.state.visible ? `` : `d-none`}`}
                            onClick={() => this.tambahData()}>
                            Add new paket
                        </button>
                    </div>
                </div>

                {/* Form modal add new paket */}
                <div className="modal fade" id="modal_paket">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header bg-success">
                                <h4 className="text-white">
                                    Form data paket
                                </h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={ev => this.simpanData(ev)}>
                                    Package Type
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.jenis_paket} onChange={ev => this.setState({ jenis_paket: ev.target.value })} />

                                    Harga
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.harga} onChange={ev => this.setState({ harga: ev.target.value })} />

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

export default Paket;