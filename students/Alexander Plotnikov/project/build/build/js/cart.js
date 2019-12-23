Vue.component('cart', {
    props: [],
    template: ` <div class="menuTop__contCart">
    <div v-on:click="openCart = !openCart; openMenu = false" class="menuTop__CartSvg"
        :class="{'menuTop__CartSvg-active':openCart}">
        <svg width="19" height="17">
            <path
                d="M18.000,4.052 L17.000,7.040 C16.630,7.878 16.105,9.032 15.000,9.032 L5.360,9.032 L5.478,10.028 L18.000,10.028 L17.000,12.019 L4.352,12.019 L3.709,12.095 L2.522,2.061 L1.000,2.061 C0.448,2.061 -0.000,1.615 -0.000,1.066 C-0.000,0.515 0.352,0.008 0.905,0.008 L4.291,-0.006 L4.545,2.145 C4.670,2.096 4.812,2.061 5.000,2.061 L17.000,2.061 C18.105,2.061 18.000,2.953 18.000,4.052 ZM6.000,13.015 C7.105,13.015 8.000,13.906 8.000,15.007 C8.000,16.107 7.105,16.998 6.000,16.998 C4.895,16.998 4.000,16.107 4.000,15.007 C4.000,13.906 4.895,13.015 6.000,13.015 ZM14.000,13.015 C15.105,13.015 16.000,13.906 16.000,15.007 C16.000,16.107 15.105,16.998 14.000,16.998 C12.896,16.998 12.000,16.107 12.000,15.007 C12.000,13.906 12.896,13.015 14.000,13.015 Z" />
        </svg>
    </div>
    <span class="menuTop__spanCart">Cart</span>
    <span class="menuTop__countCart">{{ quantity }}</span>
    <div class="contCartProducts" :class="{'contCartProducts-active':openCart}" id="contCartProducts">
        <div class="contCartProducts__bodyCart">
        <cart-item v-for="product in cartItems"  :prod="product"   :key="product.id" ></cart-item>        
            <div class="contCartProducts__rethult">
                <span class="contCartProducts__span">Итого:</span>
                <span class="contCartProducts__allSumm">$ {{sum}}</span>
                <span class="contCartProducts__allQuantity">{{quantity}}</span>
                <button @click=" cleanCart" class="contCartProducts__allClean">X</button>
            </div>
         </div>
     </div>
 </div>  `,
    data() {
        return {
            cartURL: '/cart',
            AddToCartURL: '/addToBasket',
            DeleteFromCartURL: '/deleteFromBasket',
            cartItems: [],
            openCart: false,
            openMenu: false
        }
    },
    methods: {
        cleanCart() {
            this.openCart = false
            this.$root.getData(this.DeleteFromCartURL)
                .then(data => {
                    if (data.result == 1) {
                        this.cartItems = []
                    }
                    this.postFetch(this.DeleteFromCartURL)
                })
        },
        postFetch(url) {
            return fetch(url, { // отправляем новый файл корзины на сервер
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: this.jsonCart
                })
                .then(data => data.json())
                .then(data => {
                    if (data.result == 1) {
                        console.log('Зарос прошел!')
                    }
                })
        },
        addItemInCart(prod) {
            this.$root.getData(this.AddToCartURL)
                .then(data => {
                    if (data.result == 1) { // если сервер ответил
                        let find = this.cartItems.find(item => item.id == prod.id)
                        if (find) {
                            find.quantity++
                        } else {
                            prod.quantity = "1"
                            this.cartItems.push(Object.assign({}, prod))
                        }
                        this.postFetch(this.AddToCartURL)
                    }
                })
        },
        delItemInCart(prod) {
            let find = this.cartItems.find(item => item.id == prod.id)
            this.$root.getData(this.DeleteFromCartURL)
                .then(data => {
                    if (data.result == 1) {
                        find.quantity--
                        if (find.quantity === 0) {
                            this.cartItems.splice(this.cartItems.findIndex(index => index.id == find.id), 1)
                        }
                    }
                    this.postFetch(this.DeleteFromCartURL)
                })
        }
    },
    mounted() {
        this.$root.getData(this.cartURL)
            .then(data => {
                this.cartItems = data.contents
            })
    },
    computed: {
        sum: function () {
            let summ = null
            this.cartItems.forEach(e => {
                summ += +e.price * e.quantity
            })
            return summ
        },
        quantity: function () {
            let quat = null
            this.cartItems.forEach(e => {
                quat += +e.quantity
            })
            if (this.cartItems.length === 0) {
                quat = 0
            }
            return quat
        },
        jsonCart: function () { // собираем новый фалл корзины
            let data = JSON.stringify({
                amount: this.sum,
                countGoods: this.quantity,
                contents: this.cartItems
            })
            return data
        }
    }
})