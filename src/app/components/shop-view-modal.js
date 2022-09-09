class ShopViewModal extends HTMLElement {
    set shopView(shopData) {
        this.innerHTML = `
        <style>
                @import "./src/styles/shop-view.css";
        </style>
        <form id="shop-form" class="shop-form modal-content">
            <div class="btn-row">
                <span class="modal-title">${shopData.title}</span>
                <button type="button" onclick="document.getElementById('shop-view-modal').classList.toggle('modal-open')" class="close"
                    title="Close Modal">&times;</button>
            </div>
            <div class="container">
                <div>
                    <ul>                    
                        <li><b>Name:</b> ${shopData.shopName}</li>
                        <li><b>Link:</b> <a href='${shopData.shopURL}' target='_blank'>${shopData.shopURL}</a></li>
                        <li><b>Phone:</b> ${shopData.shopPhone}</li>
                        <li><b>Email:</b> ${shopData.shopEmail}</li>
                        <li><b>Address:</b> ${shopData.shopAddress}</li>
                        <li><b>Facebook:</b> <a href='https://facebook.com' target='_blank'>${shopData.shopFacebook}</a></li>
                        <li><b>Instagram:</b> <a href='https://instagram.com' target='_blank'>${shopData.shopInstagram}</a></li>
                        <li><b>Brands:</b> ${shopData.brands}</li>
                        <li><b>Parts:</b> ${shopData.parts}</li>
                        <li><b>Warranty:</b> ${shopData.shopWarranty}</li>
                        <li class="shop-view-notes"><b>Notes:</b> ${shopData.shopNotes}</li>
                    </ul>
                </div>
            </div>
            <input id="shopId" class="shop-id" value="${shopData.shopId}" name="shopId">
            <div class="container">
                <div class="btn-row">
                    ${shopData.button}                   
                </div>
            </div>
        </form>
    </div>
        `;
    }
}

customElements.define('shop-view-modal', ShopViewModal);
