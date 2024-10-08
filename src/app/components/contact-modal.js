class ContactModal extends HTMLElement {
  set contactForm(contactData) {
    this.innerHTML = `
        <form id="shop-form" class="shop-form modal-content" name="contact" method="POST">
            <div class="btn-row">
                <span class="modal-title">Contact Us</span>
                <button type="button" onclick="document.getElementById('contact-modal').classList.toggle('modal-open')" class="close"
                    title="Close Modal">&times;</button>
            </div>
            <div class="container">
                <label class="modal-field" for="name"><b>Name</b></label>
                <input id="contact-modal-name" class="modal-field shop-field" type="text" placeholder="Your Name" name="name">
                <label class="modal-field" for="email"><b>Email</b></label>
                <input class="modal-field shop-field" type="email" placeholder="you@youremail.com" name="email">
                <label class="modal-field" for="subject"><b>Subject</b></label>
                <input class="modal-field shop-field" type="text" placeholder="What you message is about..." name="subject">
                <label class="modal-field" for="message"><b>Message</b></label>
                <textarea rows="5" cols="33" class="modal-field shop-field modal-textarea" type="text" placeholder="Message text..." name="message"
                    required></textarea>
            </div>
            <div class="container">
                <button id="contact-btn" class="modal-btn contact-btn" type="submit">Send</button>
                <div id="contact-progress-bar" class="contact-progress-bar">
                    <span id="contact-progress" class="contact-progress"></span>
                </div>
            </div>
            <input type="hidden" name="form-name" value="contact" />
        </form>
    </div>
        `;
  }
}

customElements.define("contact-modal", ContactModal);
