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
                <label class="modal-field-label" for="shopName">Name</label>
                <input id="shop-detail-modal-name" class="modal-field shop-field" type="text" placeholder="Enter Shop Name" name="shopName" value="${shopData.shopName}"
                    required>
                <label class="modal-field-label" for="shopUrl">Website</label>
                <input class="modal-field shop-field" type="url" placeholder="https://linktoshop.com" name="shopUrl" value="${shopData.shopURL}"
                    required>
                <label class="modal-field-label" for="shopPhone">Phone</label>
                <input id="shop-detail-modal-phone" class="modal-field shop-field" type="tel" placeholder="03 1234 5678" name="shopPhone" value="${shopData.shopPhone}">
                <label class="modal-field-label" for="shopEmail">Email</label>
                <input id="shop-detail-modal-email" class="modal-field shop-field" type="text" placeholder="shop@email.com" name="shopEmail" value="${shopData.shopEmail}">
                <label class="modal-field-label" for="shopAddress">Address</label>
                <input id="shop-detail-modal-address" class="modal-field shop-field" type="text" placeholder="123 Four St, Someplace, State 1234" name="shopAddress" value="${shopData.shopAddress}">
                <label class="modal-field-label" for="shopFacebook">Facebook</label>
                <input id="shop-detail-modal-facebook" class="modal-field shop-field" type="text" placeholder="/storeFacebookHandle" name="shopFacebook" value="${shopData.shopFacebook}">
                <label class="modal-field-label" for="shopInstagram">Instagram</label>
                <input id="shop-detail-modal-instagram" class="modal-field shop-field" type="text" placeholder="/storeInstagramHandle" name="shopInstagram" value="${shopData.shopInstagram}">
                <label class="modal-field-label" for="shopBrands">Brands</label>
                <textarea rows="2" cols="33" class="modal-field shop-field modal-textarea" type="text" placeholder="Brand Names, Fox, Shimano, SRAM, Rock Shox" name="shopBrands"
                required>${shopData.brands}</textarea>
                <label class="modal-field-label" for="shopProducts">Products</label>
                <textarea rows="2" cols="33" class="modal-field shop-field modal-textarea" type="text" placeholder="Product Types, Seatposts, Handlebars, Forks, Wheels, Disc Brakes" name="shopProducts"
                required>${shopData.parts}</textarea>
                <label class="modal-field-label" for="shopWarranty">Warranty</label>
                <textarea rows="2" cols="33" class="modal-field shop-field modal-textarea" type="text" placeholder="Warranty Support Brands, Fox, Shimano, SRAM" name="shopWarranty"
                >${shopData.shopWarranty}</textarea>
                <label class="modal-field-label" for="shopNotes">Notes</label>
                <textarea rows="2" cols="33" class="modal-field shop-field modal-textarea" type="text" placeholder="Any extra information about the shop..." name="shopNotes"
                >${shopData.shopNotes}</textarea>
                <input id="shopId" class="shop-id" value="${shopData.shopId}" name="shopId" type="hidden">
                <input id="shopVersion" class="shop-id" value="${shopData.version}" name="shopVersion" type="hidden">
            </div>
            <div class="container">
                <div id="changeNotes" class="change-notes">
                    <label class="modal-field-label" for="changeNotes">Change Notes   </label>
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
