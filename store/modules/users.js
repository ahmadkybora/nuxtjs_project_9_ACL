import Axios from 'axios'
import Swal from "sweetalert2";

const state = () => ({
    getUsers: {},
    isUser: {},
    myUser: {},
});

const getters = {
    getUsers(state) {
        return state.getUsers
    },
    isUser(state) {
        return state.isUser
    },
};

const actions = {

    // panel
    async getUsers(context, page = 1) {
        await Axios.get(Axios.defaults.baseURL + `panel/users?page=${page}`)
            .then(res => {
                const getUsers = res.data.data;
                context.commit('getUsers', getUsers);
            }).catch(err => {
                console.log(err)
            })
    },

    showUser(context, payload) {
        const userId = payload.id;
        const users = context.state.getUsers;
        console.log(users[3].id);
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === userId) {
                const isUser = users[i];
                context.commit('isUser', isUser);
            }
        }
    },

    editUser(context, payload) {
        const userId = payload.id;
        const users = context.state.getUsers;
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === userId) {
                const isUser = users[i];
                context.commit('isUser', isUser);
            }
        }
    },

    async isUserRegister(context, payload) {
        let formData = new FormData();
        formData.append('first_name', payload.first_name);
        formData.append('last_name', payload.last_name);
        formData.append('username', payload.username);
        formData.append('email', payload.email);
        formData.append('mobile', payload.mobile);
        formData.append('home_phone', payload.home_phone);
        formData.append('zip_code', payload.zip_code);
        formData.append('password', payload.password);
        formData.append('confirmation_password', payload.confirmation_password);
        formData.append('home_address', payload.home_address);
        formData.append('work_address', payload.work_address);
        formData.append('state', payload.state);
        formData.append('image', payload.image);

        await Axios.post(Axios.defaults.baseURL + 'panel/users/store', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            })
            .then(res => {
                switch (res.status) {
                    case 201:
                        Swal.fire('Success!', res.data.message, 'success')
                            .then(() => {
                                const getUsers = res.data.data;
                                context.commit('getUsers', getUsers);
                                //this.$router.push('/panel/users');
                            });
                        break;
                    case 403:
                        Swal.fire('Warning!', res.data.message, 'warning')
                            .then(() => {

                            });
                        break;
                    case 503:
                        Swal.fire('Danger!', 'Service is Unavailable', 'error');
                        break;
                    default:
                        Swal.fire('Warning!', 'Your Basic Information', 'warning');
                        break;
                }
            }).catch(err => {
                switch (err.response.status) {
                    case 422:
                        if (err.response.data.errors === null) {
                            Swal.fire('Warning!', err.response.data.message, 'warning')
                                .then(() => {

                                });
                        }
                        for (let i = 0; i < err.response.data.errors.length; i++) {
                            Swal.fire('Warning!', err.response.data.errors[i].message, 'warning')
                                .then(() => {

                                });
                        }
                        break;
                    case 403:
                        Swal.fire('Warning!', err.response.data.errors.message, 'warning')
                            .then(() => {

                            });
                        break;
                    case 404:
                        Swal.fire('Warning!', '404 Not Found!', 'warning')
                            .then(() => {

                            });
                        break;
                    case 500:
                        Swal.fire('Warning!', 'Service is unavailable', 'warning')
                            .then(() => {

                            });
                        break;
                    case 503:
                        Swal.fire('Warning!', 'Service is unavailable', 'warning')
                            .then(() => {

                            });
                        break;
                    default:
                        Swal.fire('Warning!', 'Your Basic Information', 'warning');
                        break;
                }
            })
    },

    async isUserUpdate(context, payload) {
        const isUpdate = {
            id: payload.id,
            first_name: payload.first_name,
            last_name: payload.last_name,
            username: payload.username,
            email: payload.email,
            mobile: payload.mobile,
            home_phone: payload.home_phone,
            zip_code: payload.zip_code,
            password: payload.password,
            confirmation_password: payload.confirmation_password,
            home_address: payload.home_address,
            work_address: payload.work_address,
        };
        await Axios.patch(Axios.defaults.baseURL + 'panel/users/' + payload.id, isUpdate)
            .then(res => {
                const getUsers = res.data.data;
                context.commit('getUsers', getUsers);
            }).catch(err => {
                console.log(err)
            })
    },

    /**
     *
     * @param context
     * @param payload
     */
    deleteUser(context, payload) {
        state.isUser = payload.id;
        const id = payload.id;
        Axios.delete(Axios.defaults.baseURL + 'panel/users/' + id)
            .then(() => {
                /*let idx = user.indexOf(id)
                const getUsers = state.getUsers.splice(idx,1)*/
                //context.commit('deleteUser', getUsers);
            }).catch(err => {
            console.log(err)
        })
    },

    /**
     *
     * @param context
     * @param payload
     * @returns {Promise<void>}
     */
    async searchUser(context, payload) {
        const full_text_search = {
            full_text_search: payload.full_text_search
        };

        await Axios.post(Axios.defaults.baseURL + 'panel/users/search', full_text_search)
            .then(res => {
                switch (res.status) {
                    case 200:
                        Swal.fire('Success!', res.data.message, 'success')
                            .then(() => {
                                const getUsers = res.data.data;
                                context.commit('getUsers', getUsers);
                            });
                        break;
                    case 403:
                        Swal.fire('Warning!', res.data.message, 'warning')
                            .then(() => {

                            });
                        break;
                    case 422:
                        Swal.fire('Error!', 'whooops', 'error')
                            .then(() => {

                            });
                        break;
                    case 503:
                        Swal.fire('Danger!', 'Service is Unavailable', 'error');
                        break;
                    default:
                        Swal.fire('Warning!', 'Your Basic Information', 'warning');
                        break;
                }
            }).catch(err => {
                switch (err.response.status) {
                    case 422:
                        for (let i = 0; i < err.response.data.errors.length; i++) {
                            Swal.fire('Warning!', err.response.data.errors[i].message, 'warning')
                                .then(() => {

                                });
                        }
                        break;
                    case 404:
                        Swal.fire('Warning!', '404 Not Found!', 'warning')
                            .then(() => {

                            });
                        break;
                    case 500:
                        Swal.fire('Warning!', 'Service is unavailable', 'warning')
                            .then(() => {

                            });
                        break;
                    case 503:
                        Swal.fire('Warning!', 'Service is unavailable', 'warning')
                            .then(() => {

                            });
                        break;
                    default:
                        Swal.fire('Warning!', 'Your Basic Information', 'warning');
                        break;
                }
            })
    },

    // profile

    async myUser(context) {
        this.$axios.get('profile/my-profile')
            .then(res => {
                const myUser = res.data.data;
                context.commit('myUser', myUser);

                /*switch (res.status) {
                    case 200:
                        Swal.fire('Success!', res.data.message, 'success')
                            .then(() => {
                                const myUser = res.data.data;
                                context.commit('myUser',myUser);
                            });
                        break;
                    case 201:
                        Swal.fire('Warning!', res.data.message, 'warning')
                            .then(() => {

                            });
                        break;
                    case 422:
                        Swal.fire('Error!', 'whooops', 'error')
                            .then(() => {

                            });
                        break;
                    case 503:
                        Swal.fire('Danger!', 'Service is Unavailable', 'error');
                        break;
                    default:
                        Swal.fire('Warning!', 'Your Basic Information', 'warning');
                        break;
                }*/
            }).catch(err => {
            switch (err.response.status) {
                case 422:
                    if (err.response.data.errors.length !== null) {
                        for (let i = 0; i < err.response.data.errors.length; i++) {
                            Swal.fire('Warning!', err.response.data.errors[i].message, 'warning')
                                .then(() => {

                                });
                        }
                    } else {
                        Swal.fire('Warning!', err.response.data.errors[i].message, 'warning')
                            .then(() => {

                            });
                    }
                    break;
                case 403:
                    if (err.response.data.errors !== null) {
                        for (let i = 0; i < err.response.data.errors.length; i++) {
                            Swal.fire('Warning!', err.response.data.errors[i].message, 'warning')
                                .then(() => {
                                    return this.$router.push('/');
                                });
                        }
                    } else {
                        Swal.fire('Warning!', err.response.data.message, 'warning')
                            .then(() => {
                                return this.$router.push('/');
                            });
                    }
                    break;
                case 404:
                    Swal.fire('Warning!', '404 Not Found!', 'warning')
                        .then(() => {

                        });
                    break;
                case 500:
                    Swal.fire('Warning!', 'Service is unavailable', 'warning')
                        .then(() => {

                        });
                    break;
                case 503:
                    Swal.fire('Warning!', 'Service is unavailable', 'warning')
                        .then(() => {

                        });
                    break;
                default:
                    Swal.fire('Warning!', 'Your Basic Information', 'warning');
                    break;
            }
        })
    },

    async myUserUpdate(context, payload) {
        let formData = new FormData();

        formData.append("first_name", payload.first_name);
        formData.append("last_name", payload.last_name);
        formData.append("username", payload.username);
        formData.append("email", payload.email);
        formData.append("mobile", payload.mobile);
        formData.append("home_phone", payload.home_phone);
        formData.append("zip_code", payload.zip_code);
        formData.append("password", payload.password);
        formData.append("confirmation_password", payload.confirmation_password);
        formData.append("home_address", payload.home_address);
        formData.append("work_address", payload.work_address);
        formData.append("image", payload.image);

        this.$axios.post('profile/my-profile/update/' + payload.id, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                switch (res.status) {
                    case 200:
                        Swal.fire('Success!', res.data.message, 'success')
                            .then(() => {
                                const myUser = res.data.data;
                                context.commit('myUser', myUser);
                            });
                        break;
                    case 403:
                        Swal.fire('Warning!', res.data.message, 'warning')
                            .then(() => {

                            });
                        break;
                    case 422:
                        Swal.fire('Error!', 'whooops', 'error')
                            .then(() => {

                            });
                        break;
                    case 503:
                        Swal.fire('Danger!', 'Service is Unavailable', 'error');
                        break;
                    default:
                        Swal.fire('Warning!', 'Your Basic Information', 'warning');
                        break;
                }
            }).catch(err => {
            switch (err.response.status) {
                case 422:
                    for (let i = 0; i < err.response.data.errors.length; i++) {
                        Swal.fire('Warning!', err.response.data.errors[i].message, 'warning')
                            .then(() => {

                            });
                    }
                    break;
                case 404:
                    Swal.fire('Warning!', '404 Not Found!', 'warning')
                        .then(() => {

                        });
                    break;
                case 500:
                    Swal.fire('Warning!', 'Service is unavailable', 'warning')
                        .then(() => {

                        });
                    break;
                case 503:
                    Swal.fire('Warning!', 'Service is unavailable', 'warning')
                        .then(() => {

                        });
                    break;
                default:
                    Swal.fire('Warning!', 'Your Basic Information', 'warning');
                    break;
            }
        })
    }
};

const mutations = {
    myUser(state, payload) {
        state.myUser = payload
    },
    isUser(state, payload) {
        state.isUser = payload
    },
    getUsers(state, payload) {
        state.getUsers = payload
    },
    showUser(state, payload) {
        state.isUser = payload
    },
    editUser(state, payload) {
        state.isUser = payload
    },
    deleteUser(state, payload) {
        state.getUsers = payload
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
