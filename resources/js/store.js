import {isLoggedIn, logOut} from "./shared/utils/auth";

export default {
    state: {
        lastSearch: {
            from: null,
            to: null,
        },
        basket: {
            items: []
        },
        isLoggedIn: false,
        user: {}
    },
    mutations: {
        setLastSearch(state, payload) {
            state.lastSearch = payload;
        },
        addToBasket(state, payload) {
            state.basket.items.push(payload);
        },
        removeFromBasket(state, payload) {
            state.basket.items = state.basket.items.filter(item => item.bookable.id !== payload);
        },
        setBasket(state, payload) {
            state.basket = payload;
        },
        setUser(state, payload) {
            state.user = payload;
        },
        setLoggedIn(state, payload) {
            state.isLoggedIn = payload;
        }
    }
    ,
    actions: {
        setLastSearch(context, payload) {
            context.commit('setLastSearch', payload);
            localStorage.setItem('lastSearch', JSON.stringify(payload));
        },
        setLastSearchFromLocalStorage(context) {
            const lastSearch = localStorage.getItem('lastSearch');

            if (lastSearch) {
                context.commit('setLastSearch', JSON.parse(lastSearch));
            }

            const basket = localStorage.getItem('basket');

            if (basket) {
                context.commit('setBasket', JSON.parse(basket));
            }

            context.commit('setLoggedIn', isLoggedIn());
        },
        addToBasket(context, payload) {
            context.commit('addToBasket', payload);
            localStorage.setItem('basket', JSON.stringify(context.state.basket));
        },
        removeFromBasket(context, payload) {
            context.commit('removeFromBasket', payload);
            localStorage.setItem('basket', JSON.stringify(context.state.basket));
        },
        clearBasket(context, payload) {
            context.commit('setBasket', {items: []});
            localStorage.setItem('basket', JSON.stringify(context.state.basket));
        },
        async loadUser(context, payload) {
            if (isLoggedIn()) {
                try {
                    const user = (await axios.get('/user')).data;
                    context.commit('setUser', user);
                    context.commit('setLoggedIn', true);
                } catch(error) {
                    context.dispatch('logout');
                }
            }
        },
        logout(context, payload) {
            context.commit('setUser', {});
            context.commit('setLoggedIn', false);
            logOut();
        }
    },
    getters: {
        itemsInBasket: (state) => state.basket.items.length,
        inBasketAlready(state) {
            return function(id) {
                return state.basket.items.reduce((previousResult, currentItem) => previousResult || currentItem.bookable.id == id, false);
            }
        }
    }
};
