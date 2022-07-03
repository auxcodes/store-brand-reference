class ShopDetailModal extends HTMLElement {
    set shopDetail(shopData) {
        this.innerHTML = `
        <form id="shop-form" class="shop-form modal-content">
            <div class="btn-row">
                <span class="modal-title">${shopData.title}</span>
                <button type="button" onclick="document.getElementById('shop-detail-modal').classList.toggle('modal-open')" class="close"
                    title="Close Modal">&times;</button>
            </div>
            <div class="container">
                <label class="modal-field" for="shopName"><b>Name</b></label>
                <input id="shop-detail-modal-name" class="modal-field shop-field" type="text" placeholder="Enter Shop Name" name="shopName" value="${shopData.shopName}"
                    required>
                <label class="modal-field" for="shopUrl"><b>Shop Link</b></label>
                <input class="modal-field shop-field" type="url" placeholder="https://linktoshop.com" name="shopUrl" value="${shopData.shopURL}"
                    required>
                <label class="modal-field" for="shopBrands"><b>Brands</b></label>
                <textarea rows="2" cols="33" class="modal-field shop-field modal-textarea" type="text" placeholder="Brand Names, Fox, Shimano, SRAM, Rock Shox" name="shopBrands"
                required>${shopData.brands}</textarea>
                <label class="modal-field" for="shopProducts"><b>Products</b></label>
                <textarea rows="2" cols="33" class="modal-field shop-field modal-textarea" type="text" placeholder="Product Types, Seatposts, Handlebars, Forks, Wheels, Disc Brakes" name="shopProducts"
                required>${shopData.parts}</textarea>
                <input id="shopId" class="shop-id" value="${shopData.shopId}" name="shopId">
            </div>
            <div class="container">
                <div id="changeNotes" class="change-notes">
                    <label class="modal-field" for="changeNotes">Change Notes   </label>
                    <textarea rows="2" cols="33" class="modal-field shop-field modal-textarea" type="text" placeholder="Notes, reason for update/deletion" name="changeNotes"
                    required></textarea>
                </div>
                <div class="btn-row">
                    ${shopData.button}                   
                </div>
            </div>
        </form>
    </div>
        `;
    }
}

customElements.define('shop-detail-modal', ShopDetailModal);
