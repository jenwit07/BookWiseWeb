import {
  configure,
  observable,
  action,
  runInAction,
  computed,
  makeObservable,
} from "mobx";
import { serverApi } from "../../api";

configure({ enforceActions: "observed" });

export default class AuthStore {
  constructor() {
    makeObservable(this, {
      state: observable,
      message: observable,
      session: observable,
      isAuthenticated: observable,
      accessToken: observable,
      isLoggedOut: observable,
      otpRef: observable,
      phoneNo: observable,
      permissions: computed,
      logout: action,
      login: action,
      getSession: action,
      getFullName: computed,
      getUsername: computed,
    });
  }
  state = null; // "pending" / "done" / "error"
  message = null;
  session = { permissions: [] };
  isAuthenticated = false;
  otpRef = false;
  phoneNo = null;
  accessToken = null;
  isLoggedOut = false;

  async login(body) {
    this.state = "pending";
    try {
      console.log(body)
      const { data } = await serverApi().post("/login", {
        ...body
      });
      // after await, modifying state again, needs an actions:
      runInAction(async () => {
        this.session = data;
        this.state = "done";
        this.isAuthenticated = true;
        this.isLoggedOut = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(async () => {
        this.state = "error";

      });
      throw error
    }
  }

  async logout() {
    try {
      this.state = "pending";
      const { data } = await serverApi().post("/logout");
      // after await, modifying state again, needs an actions:
      runInAction(() => {
        this.isAuthenticated = false;
        this.token = null;
        this.state = null;
        this.message = null;
        this.session = {};
        this.isLoggedOut = true;
        this.state = "done";
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.state = "error";
        this.message = error.response.data.message;
      });
    }
  }

  async getSession(access_token = null, otp = false) {
    this.state = "pending";
    try {
      const { data } = await serverApi().get("/session", {
        params: { access_token, otp },
      });
      // after await, modifying state again, needs an actions:
      runInAction(() => {
        this.session = data;
        if (data.authenticated) {
          this.isAuthenticated = true;
          this.isLoggedOut = false;
        }
        this.state = "done";
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.state = "error";
        // this.message = error.response.data.message ? error.response.data.message : "";
      });
    }
  }

  async getToken() {
    this.state = "pending";
    try {
      const { data } = await serverApi().get("/token");
      // after await, modifying state again, needs an actions:
      runInAction(() => {
        this.session.access_token = data;
        this.state = "done";
      });
    } catch (error) {
      runInAction(() => {
        this.state = "error";
        this.message = error.response.data.message;
      });
    }
  }

  get permissions() {
    return this.session.permissions;
  }

  get getFullName() {
    return this.session.first_name + " " + this.session.last_name;
  }

  get getUsername() {
    return this.session.username;
  }
}
