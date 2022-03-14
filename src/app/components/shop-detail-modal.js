class ShopDetailModal extends HTMLElement {
    set modal(modal) {
        this.innerHTML = `
        <form id="shop-form" class="shop-form modal-content animate">
            <div class="btn-row">
                <span onclick="document.getElementById('shop-detail-modal').style.display='none'" class="close"
                    title="Close Modal">&times;</span>
            </div>
            <div class="container">
                <label class="modal-field" for="shopName"><b>Name</b></label>
                <input class="modal-field shop-field" type="text" placeholder="Enter Shop Name" name="shopName"
                    required>
                <label class="modal-field" for="shopUrl"><b>Shop Link</b></label>
                <input class="modal-field shop-field" type="Link" placeholder="https://linktoshop.com" name="shopUrl"
                    required>
                <label class="modal-field" for="shopBrands"><b>Brands</b></label>
                <input class="modal-field shop-field" type="text" placeholder="Brand One, Brand Two, Brand Three" name="shopBrands"
                    required>
                <label class="modal-field" for="shopProducts"><b>Products</b></label>
                <input class="modal-field shop-field" type="text" placeholder="Product One, Product Two, Product Three" name="shopProducts"
                    required>
            </div>
            <div class="container">
                <div class="btn-row">
                    <button id="login-btn" class="modal-btn add-btn" type="submit">Add</button>
                    <button id="signup-btn" class="modal-btn updae-btn" type="submit">Update</button>
                </div>
            </div>
        </form>
    </div>
        `;
    }
}

customElements.define('shop-detail-modal', ShopDetailModal);
