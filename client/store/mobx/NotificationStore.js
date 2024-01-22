import { configure, observable, action, makeObservable } from "mobx";
configure({ enforceActions: "observed" });
export default class NotificationStore {
  constructor() {
    makeObservable(this);
  }

  @observable message = null;
  @observable type = null;
  @observable visible = false;
  @observable messageTitle = null;

  @action
  setVisible(visible) {
    this.visible = visible;
  }

  @action
  setError(message, title) {
    this.type = "error";
    this.message = message;
    this.visible = true;
    this.messageTitle = title || "Error";
  }

  @action
  setInfo(message, title) {
    this.type = "info";
    this.message = message;
    this.visible = true;
    this.messageTitle = title || "Info";
  }

  @action
  setSuccess(message, title) {
    this.type = "success";
    this.message = message;
    this.visible = true;
    this.messageTitle = title || "Success";
  }

  @action
  setWarning(message, title) {
    this.type = "success";
    this.message = message;
    this.visible = true;
    this.messageTitle = title || "Warning";
  }
}
