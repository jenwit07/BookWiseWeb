import { makeObservable, observable, action, computed } from "mobx";

// Toggle_Menu, webToken
class commonStore {
  constructor() {
    makeObservable(this);
  }

  @observable
  initialState = {
    collapsed: false,
    toggle: false,
    hidden: false,
    show_drawer: { visible: false, placement: "left" }
  };

  @action
  toggleMenu(_collapsed, _toggle, _hidden = false) {
    this.initialState.collapsed = _collapsed;
    this.initialState.toggle = _toggle;
    this.initialState.hidden = _hidden;
  }

  @action
  toggleDrawer(_visible, _placement) {
    this.initialState.collapsed = false;
    this.initialState.toggle = false;
    this.initialState.show_drawer.visible = !this.initialState.show_drawer
      .visible;
    this.initialState.show_drawer.placement = "left";
  }

  @computed
  get getCollapsed() {
    return this.initialState.collapsed
  }
}

// decorate(commonStore, {
//   hello: observable,
//   initialState: observable,
//   toggleMenu: action,
//   toggleDrawer: action,
//   getCollapsed: computed
// });

export default commonStore;
