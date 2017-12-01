import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import {Navbar, Col, Badge, Image, Button, OverlayTrigger, Popover, strong} from "react-bootstrap";
import FaIcon from "robe-react-ui/lib/faicon/FaIcon";
import Link from "react-router/lib/Link";
import cookie from "react-cookie";
import "./style.css";
import {Tooltip} from 'primereact/components/tooltip/Tooltip';

export default class Header extends ShallowComponent {
    static propTypes = {
        matches: React.PropTypes.bool,
        toggled: React.PropTypes.bool
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    static defaultProps = {
        toggled: false,
        matches: false
    };

    logoutPost = new AjaxRequest({
        url: "logout",
        type: "POST"
    });

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    render() {

        const popoverBottom = (
            <Popover id="popover-positioned-bottom" title="Bildirimler">
                Yeni yildiriminiz bulunmamaktadır.
            </Popover>
        );

        return (
            <Col className="robe-navbar">
                <div className="robe-navbar-content">
                    <Col className="pull-left">
                        <Button onClick={this.__onToggle}
                                style={{margin: 4, padding: 10, display: this.props.toggled ? "none" : "inherit"}}
                                className="navbar-toggle pull-left robe-navbar-button">
                            <span className="icon-bar" style={{background: "#173646", height: 3}}/>
                            <span className="icon-bar" style={{background: "#173646", height: 3}}/>
                            <span className="icon-bar" style={{background: "#173646", height: 3}}/>
                        </Button>
                        <Button onClick={this.__onToggle}
                                style={{
                                    margin: 4.5,
                                    padding: 5,
                                    display: this.props.matches && this.props.toggled ? "inherit" : "none"
                                }}
                                className="navbar-toggle pull-left robe-navbar-button">
                            <FaIcon code="fa-arrow-left" size="fa-lg"/>
                        </Button>
                        <Image src="./logo.png"
                               className="pull-left"
                               style={{marginLeft: 5}}
                               circle
                               width="40"/>
                        <Link to={window.applicationRootPath}>
                            <Col style={{display: this.props.matches ? "none" : "inherit"}}>Nebula Acente Sistemi</Col>
                        </Link>
                        <Link to={window.applicationRootPath}>
                            <Col style={{display: this.props.matches ? "inherit" : "none"}}>Nebula</Col>
                        </Link>
                    </Col>
                    <Col className="pull-right">
                        <Tooltip for="#user" title="Kullanıcı Yönetimi" tooltipPosition="top"/>
                        <Button
                            id="user"
                            className="robe-navbar-button" onClick={this.__onUser}>
                            <FaIcon code="fa-user"/>
                        </Button>
                        <Tooltip for="#messageCount" title="Mesajlar" tooltipPosition="top"/>
                        <Button
                            id="messageCount"
                            className="robe-navbar-button"
                        >
                            <FaIcon code="fa-comments-o"/>
                            <Badge>{this.state.messageCount}</Badge>
                        </Button>
                        <Tooltip for="#notificationCount" title="Bildirimler" tooltipPosition="top"/>
                        <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
                            <Button
                                id="notificationCount"
                                className="robe-navbar-button">
                                <FaIcon code="fa-bell"/>
                                <Badge>{this.state.notificationCount}</Badge>
                            </Button>
                        </OverlayTrigger>
                        <Tooltip for="#exit" title="Çıkış" tooltipPosition="top"/>
                        <Button
                            id="exit"
                            className="robe-navbar-button"
                            onClick={this.__onExit}>
                            <FaIcon code="fa-sign-out"/>
                        </Button>
                    </Col>
                </div>
            </Col>
        );
    }

    __onUser = () => {
        this.context.router.push("Site/UserManager");
    };
    __onExit = () => {
        cookie.remove('domain');
        cookie.remove('username');
        window.location.hash = "";

        this.logoutPost.call(undefined, undefined,
            function (res) {
                location.reload();
            }.bind(this),
            function (res) {
                location.reload();
            }.bind(this));
    };

    __onToggle = () => {
        if (this.props.onToggle)
            this.props.onToggle();
    }
}
