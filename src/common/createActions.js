export const createActions = (store) => ({
  updateNotifications: (messages, unread) =>
    store.setState({ notificationsAdmin: messages, unreadAdmin: unread }),
  markAsReaded: (id, time) => {
    let notAdm, noti;
    if (store.state.notificationsAdmin !== "") {
      notAdm = JSON.parse(store.state.notificationsAdmin);
    }
    let notifs =
      store.state.notificationsAdmin === "" ? [] : notAdm.params.data;
    if (notifs.length > 0) {
      noti = notifs.filter((n) => {
        return n.id === id && n.timestamp === time;
      });
      if (noti[0] !== undefined) {
        let index = notifs.indexOf(noti[0]);
        noti[0].readed = true;
        if (index !== -1) {
          notifs[index] = noti[0];
          notAdm.params.data = notifs;
        }
      }
      let unread = 0;
      notifs.map((n) => {
        if (!n.readed) unread++;
      });
      store.setState({
        notificationsAdmin: JSON.stringify(notAdm),
        unreadMessages: unread,
      });
    }
  },
  setTokenSession: (token) => {
    store.setState({
      token: token,
    });
  },
});
