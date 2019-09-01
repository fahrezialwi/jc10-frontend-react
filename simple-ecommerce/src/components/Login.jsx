import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

// Action Creator
// Setelah dimasukkan ke connect, akan dipanggil sebagai this.props.onLoginUser
const onLoginUser = (dataId, dataUsername) => {
    
    // Action
    // Ini akan jadi parameter kedua di AuthReducer
    return {
        type: 'LOGIN_SUCCESS',
        payload: {
            id: dataId,
            username: dataUsername
        }
    }
}

// Function yang akan mengambil data dari redux state dan menjadikannya props
const mapStateToProps = (state) => {
    return {
        username: state.auth.username
    }
}

class Login extends Component {
    
    onLoginClick = () => {
        // Hanya ketika menggunakan GET, data harus di dalam params: {}
        axios.get (
            'http://localhost:2019/users',
            {
                params: {
                    username: this.username.value,
                    password: this.password.value
                }
            }
        ).then((res)=> {

            // res.data merupakan sebuah array
            // jika data ditemukan, length > 0
            // jika data tidak ditemukan, length = 0
            if (res.data.length === 0){
                console.log('User tidak ditemukan')
            } else {
                // mengambil properti id dan username dari object res.data[0]
                let{id, username} = res.data[0]

                // 1. Mengirim data ke redux
                this.props.onLoginUser(id,username)

                // 2. Mengirim data ke local storage
                localStorage.setItem(
                    'userData',
                    JSON.stringify({id, username})
                    // JSON.stringify akan mengubah bentuk object menjadi string 
                )
            }
        })
    }

    render() {
        if(!this.props.username){
            return (
                <div className="container login-top">
                <div className="row">
                    <div className="col-sm-8 col-md-4 mx-auto">
                        <div className="card-body">
                            <h2>Login</h2>
                            <form>
                                <div className="input-group"><input ref={(input)=>{this.username = input}} type="text" className="form-control mt-3" placeholder="Username"/></div>
                                <div className="input-group"><input ref={(input)=>{this.password = input}} type="password" className="form-control mt-3" placeholder="Password"/></div>
                            </form>

                            <div className="text-center">
                                <button className="btn btn-block btn-success mt-4" onClick={this.onLoginClick}>Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
        } else {
            return <Redirect to='/'/>
        }
    }
}

export default connect(mapStateToProps,{onLoginUser})(Login)

