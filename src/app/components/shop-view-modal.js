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
                <div class="view-rows-container">                 
                    <div class="view-row"><span class="view-label">Name:</span> <span class="view-data">${shopData.shopName}</span></div>
                    <div class="view-row"><span class="view-label">Website:</span> <span class="view-data"><a href='${shopData.shopURL}' target='_blank'>${shopData.shopURL}</a></span></div>
                    <div class="view-row"><span class="view-label">Phone:</span> <span class="view-data">${shopData.shopPhone}</span></div>
                    <div class="view-row"><span class="view-label">Email:</span> <span class="view-data">${shopData.shopEmail}</span></div>
                    <div class="view-row"><span class="view-label">Address:</span> <span class="view-data">${shopData.shopAddress}</span></div>
                    <div class="view-row"><span class="view-label">Facebook:</span> <span class="view-data">${shopData.facebookLinks}</span></div>
                    <div class="view-row"><span class="view-label">Instagram:</span> <span class="view-data">${shopData.instagramLinks}</span></div>
                    <div class="view-row"><span class="view-label">Brands:</span> <span class="view-data">${shopData.brands}</span></div>
                    <div class="view-row"><span class="view-label">Parts:</span> <span class="view-data">${shopData.parts}</span></div>
                    <div class="view-row"><span class="view-label">Warranty:</span> <span class="view-data">${shopData.shopWarranty}</span></div>
                    <div class="view-row"><span class="view-label">Notes:</span> <span class="view-data view-data-mono">${shopData.shopNotes}</span> </div>
                </div>
            </div>
            <input id="shopId" class="shop-id" value="${shopData.shopId}" name="shopId" type="hidden">
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
