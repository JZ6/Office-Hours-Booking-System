//Static components, such as loading Animations
import React, {
    createElement as h
} from "react"

function getLoadingAnimation() {
    return h("div", {
        className: "login-LoadingOverlay",
    }, [
            h("div", {
                className: "login-loader"
            }, [
                    h("div", {}),
                    h("div", {}),
                    h("div", {}),
                    h("div", {}),
                    h("div", {}),
                    h("div", {}),
                    h("div", {}),
                    h("div", {})
                ])
        ])
}