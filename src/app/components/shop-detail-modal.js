class ShopDetailModal extends HTMLElement {
    set shopDetail(shopData) {
        this.innerHTML = `
        <form id="shop-form" class="shop-form modal-content animate">
            <div class="btn-row">
                <span onclick="document.getElementById('shop-detail-modal').style.display='none'" class="close"
                    title="Close Modal">&times;</span>
            </div>
            <div class="container">
                <label class="modal-field" for="shopName"><b>Name</b></label>
                <input class="modal-field shop-field" type="text" placeholder="Enter Shop Name" name="shopName" value="${shopData.shopName}"
                    required>
                <label class="modal-field" for="shopUrl"><b>Shop Link</b></label>
                <input class="modal-field shop-field" type="Link" placeholder="https://linktoshop.com" name="shopUrl" value="${shopData.shopURL}"
                    required>
                <label class="modal-field" for="shopBrands"><b>Brands</b></label>
                <input class="modal-field shop-field" type="text" placeholder="Brand One, Brand Two, Brand Three" name="shopBrands" value="${shopData.brands}"
                    required>
                <label class="modal-field" for="shopProducts"><b>Products</b></label>
                <input class="modal-field shop-field" type="text" placeholder="Product One, Product Two, Product Three" name="shopProducts" value="${shopData.parts}"
                    required>
                    <span id="shopId" class="shop-id">${shopData.shopId}</span>
            </div>
            <div class="container">
                <div class="btn-row">
                    <button id="add-btn" class="modal-btn add-btn" type="submit">Add</button>
                    <button id="update-btn" class="modal-btn update-btn" type="submit">Update</button>
                </div>
            </div>
        </form>
    </div>
        `;
    }
}

customElements.define('shop-detail-modal', ShopDetailModal);
