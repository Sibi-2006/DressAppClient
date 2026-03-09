import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchCart = async () => {
        if (!user) {
            setCartItems([]);
            return;
        }
        try {
            const { data } = await api.get('/cart');
            setCartItems(data.items || []);
        } catch (error) {
            console.error('Failed to fetch cart', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (item) => {
        if (!user) {
            sessionStorage.setItem('redirectAfterLogin', '/cart');
            return;
        }
        try {
            const { data } = await api.post('/cart/add', item);
            setCartItems(data.items);
            toast.success('Added to cart!', {
                style: { background: '#0a0a0a', color: '#39ff14', border: '1px solid #39ff14', boxShadow: '0 0 10px #39ff14' }
            });
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    const removeFromCart = async (id) => {
        try {
            const { data } = await api.delete(`/cart/remove/${id}`);
            setCartItems(data.items);
            toast.success('Removed from cart', {
                style: { background: '#0a0a0a', color: '#ff2d78', border: '1px solid #ff2d78', boxShadow: '0 0 10px #ff2d78' }
            });
        } catch (error) {
            toast.error('Failed to remove from cart');
        }
    };

    const updateQuantity = async (id, quantity) => {
        if (quantity < 1) return;
        try {
            const { data } = await api.patch('/cart/update', { itemId: id, quantity });
            setCartItems(data.items);
        } catch (error) {
            toast.error('Failed to update quantity');
        }
    };

    const clearCart = async () => {
        try {
            await api.delete('/cart/clear');
            setCartItems([]);
        } catch (error) {
            console.error('Failed to clear cart');
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
