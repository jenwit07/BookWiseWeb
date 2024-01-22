// @flow
import { observable, action, makeObservable } from "mobx";

export default class LayoutStore {
  pageTitle = "Oops?!!";
  siderSmallFlag = false;

  constructor() {
    makeObservable(this, {
      pageTitle: observable,
      setPageTitle: action,
      siderSmallFlag: observable,
      setSiderSmallFlag: action
    });
  }

  setPageTitle(title) {
    this.pageTitle = title;
  }

  setSiderSmallFlag(flag) {
    this.siderSmallFlag = flag;
  }
}
