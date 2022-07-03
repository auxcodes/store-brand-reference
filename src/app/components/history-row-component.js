class HistoryRowComponent extends HTMLElement {
    set historyRow(content) {
        this.innerHTML = `
        <div class="history-row">
            <span class="history-text"><b>Date:</b> ${content.date}</span>  
            <span class="history-text"><b>Changed by:</b> ${content.user}</span> 
            <span class="history-text"><b>Change type:</b> ${content.type}</span> 
            <span class="history-text"><b>Store:</b> ${content.store}</span>    
            <span class="history-text"><b>Url:</b> ${content.url}</span>    
            <span class="history-text"><b>Brands:</b> ${content.brands}</span>    
            <span class="history-text"><b>Products:</b> ${content.products}</span>    
        </div>
        `;
    }
}

customElements.define('history-row-component', HistoryRowComponent);