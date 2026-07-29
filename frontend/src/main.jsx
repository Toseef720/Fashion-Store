import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
        <ToastProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </ToastProvider>
    </AuthProvider>
);