import {configure, observable, action, runInAction, makeObservable} from 'mobx'
import {serverApi} from '../../api'

configure({enforceActions: "observed"});

export default class UserStore {
  constructor() {
    makeObservable(this);
  }
  @observable state = null; // "pending" / "done" / "error"
  @observable message = null;
  @observable user = null;

  @action
  async read(username) {
    this.state = "pending";
    try {
      const {data, headers} = await serverApi().get("/v1/user", {
        params: {
          domain: process.env.AUTH_DOMAIN,
          user: username,
        },
      });
      
      // after await, modifying state again, needs an actions:
      runInAction(() => {
        this.user = data.result[0];
        this.user['x-signature'] = headers['x-signature']
        this.state = "done";
      })
    } catch (error) {
      runInAction(() => {
        this.state = "error";
        this.message = error.response.data.message
      })
    }
  }

  @action
  async update(user) {
    this.state = "pending";
    try {
      user.domain = process.env.AUTH_DOMAIN;
      user.status = this.user.status;
      const {data} = await serverApi().put("/v1/user", user);
      // after await, modifying state again, needs an actions:
      runInAction(() => {
        this.user = data;
        this.state = "done";
      })
    } catch (error) {
      runInAction(() => {
        this.state = "error";
        this.message = error.response.data.message
      })
    }
  }

  @action
  async create(user) {
    this.state = "pending";
    try {
      const {data} = await serverApi().post("/v1/user", user);
      // after await, modifying state again, needs an actions:
      runInAction(() => {
        this.user = data;
        this.state = "done";
      })
    } catch (error) {
      runInAction(() => {
        this.state = "error";
        this.message = error.response.data.message
      })
    }
  }

  @action
  async verifyPassword({user, password}) {
    this.state = "pending";
    try {
      const {data} = await serverApi().post("/v1/login", {
          domain: process.env.AUTH_DOMAIN,
          user: user,
          password: password,
      });
      // after await, modifying state again, needs an actions:
      runInAction(() => {
        this.user = data;
        this.state = "done";
      })
    } catch (error) {
      runInAction(() => {
        this.state = "error";
        this.message = error.response.data.message
      })
    }
  }
}
