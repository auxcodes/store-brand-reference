const notificationObjects = [
    {
        id: 'notif-01',
        content: `
        <span class="notif-text">This is currently a proof of concept; store information is currently incomplete as it is being added manually. </span><br />
        <span class="notif-text">Search results will not provide all available options. </span><br />
        <span class="notif-text">Future updates will include: update/edit store information, add new store and login only access.</span>
        `,
        show: true
    },
    {
        id: 'notif-2501',
        content: `
        <span class="notif-text">Update 25/01: Added link to PSI's new website. </span>    
        `,
        show: true
    }
];

const notificationsContainer = document.getElementById("notifications");

function generateNotifications() {
    notificationObjects.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('notification-bar');
        div.id = item.id;
        div.innerHTML = `<span onclick="closeNotification(${item.id})" class="notif-close" title="Close Modal">&times;</span>` + item.content;
        notificationsContainer.append(div);
    });
}

function closeNotification() {
    document.getElementById('notif-01').style.display = 'none';
    console.log('close notification');
}

export { generateNotifications, closeNotification }