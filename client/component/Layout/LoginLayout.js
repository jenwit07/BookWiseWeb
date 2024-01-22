import React from "react";
import {Layout} from 'antd';
import background from "../../images/background/login.png";

const LoginLayout = ({children}) => {
    return (
        <Layout style={{backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center"}}>
            {children}
        </Layout>
    );
};

export default LoginLayout;
