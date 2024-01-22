import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import localeActions from "../../store/redux/actions/localeActions";
import {Menu} from "antd";
import Flag from "react-flags";
import './LanguagePicker.less';
// const lang = "th";


const LanguagePicker = () => {
    const lang = localStorage.getItem("i18nextLng") || process.env.DEFAULT_LANGUAGE;
    const [key, setKey] = useState(lang);
    const dispatch = useDispatch();
    const languages = JSON.parse(process.env.LANGUAGES);

    return key && (
        <Menu
            key="language"
            selectable={false}
            selectedKeys={[key]}
            onClick={data => {
                setKey(data.key);
                dispatch(localeActions.setLocale(data.key));
                localStorage.setItem("i18nextLng", data.key);
            }}
            mode="horizontal"
            className={'language-picker'}
            style={{border:'none'}}
        >
            <Menu.SubMenu
                style={{border: 'none'}}
                title={
                    <Flag
                        name={languages[key].code.substr(-2)}
                        format="svg"
                        flat={true}
                        alt={languages[key].text}
                        basePath={"/public/flags"}
                        width={18}
                        height={16}
                    />
                }
            >
                {Object.keys(languages).map((key) => {
                    return (
                        <Menu.Item key={key}>
                            <Flag
                                name={languages[key].code.substr(-2)}
                                format="svg"
                                flat={true}
                                alt={languages[key].text}
                                basePath={"/public/flags"}
                                width={18}
                                height={16}
                            />
                            <span style={{marginLeft: 5}}>{languages[key].text}</span>
                        </Menu.Item>
                    );
                })}
            </Menu.SubMenu>
        </Menu>
    );
};

export default LanguagePicker;
