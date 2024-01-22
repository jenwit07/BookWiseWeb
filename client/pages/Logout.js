import * as React from "react";
import {Redirect, useHistory} from "react-router-dom";
import {useStore} from "../store/mobx";
import {useEffect} from "react";

const Logout = () => {
    const {authStore} = useStore();
    const history = useHistory();

    useEffect(() => {
        (async () => {
            await authStore.logout();
            history.push('/login');
        })();
    }, []);

    return authStore.isLoggedOut && (
        <Redirect to="/login" push={true}/>
    );
};
export default Logout
