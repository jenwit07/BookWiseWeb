import React, { useCallback, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { Table, Input, Button, Row, message, Menu, Dropdown, Drawer, Modal, Descriptions, ConfigProvider } from 'antd';
import thTH from 'antd/es/locale/th_TH';
import enUS from 'antd/es/locale/en_US';
import 'antd/dist/antd.css';
import { observer } from 'mobx-react';
import { action, runInAction, makeObservable, observable } from 'mobx';
import 'dayjs';
import { SearchOutlined, CloseCircleTwoTone, DownOutlined, UnlockOutlined, ReadOutlined, DeleteFilled, EyeFilled, EditFilled, EditOutlined } from '@ant-design/icons';
import 'antd/es/pagination';
import 'moment';

var Save = "บันทึก";
var Option = "ตัวเลือก";
var Edit = "แก้ไข";
var Delete = "ลบ";
var Details = "รายละเอียด";
var Warning = "แจ้งเตือน";
var Saving = "กำลังบันทึกข้อมูล...";
var Cancel = "ยกเลิก";
var Active = "เปิดใช้งาน";
var Inactive = "ปิดใช้งาน";
var disable_status = "ปิดการใช้งาน";
var enable_status = "เปิดการใช้งาน";
var confirm_disable_status = "คุณต้องการปิดการใช้งาน";
var confirm_enable_status = "คุณต้องการเปิดการใช้งาน";
var Domain = "โดเมน";
var Permission = "การอนุญาต";
var Create_at = "วันที่สร้าง";
var Created_by = "สร้างโดย";
var Updated_at = "วันที่ปรับปรุง";
var Updated_by = "ปรับปรุงโดย";
var Description = "รายละเอียด";
var Name = "ชื่อ";
var Access = "การเข้าถึง";
var Allow = "อนุญาต";
var Deny = "ปิดกั้น";
var Role = "บทบาท";
var User = "ผู้ใช้งาน";
var Copy = "คัดลอก";
var Search = "ค้นหา...";
var Impersonate = "ใช้งานระบบตัวแทน";
var Settings = "การตั้งค่า";
var Username = "ชื่อผู้ใช้งาน";
var Email = "อีเมล์";
var Password = "รหัสผ่าน";
var PIN = "PIN";
var Properties = "คุณสมบัติ";
var th = {
	Save: Save,
	Option: Option,
	"View details": "ดูรายละเอียด",
	Edit: Edit,
	Delete: Delete,
	Details: Details,
	Warning: Warning,
	Saving: Saving,
	Cancel: Cancel,
	"Save success": "บันทึกข้อมูลเรียบร้อยแล้ว",
	"Save failed": "ไม่สามารถบันทึกได้",
	Active: Active,
	Inactive: Inactive,
	"Confirm save": "ยืนยันการบันทึก",
	"Save new data": "คุณต้องการบันทึกข้อมูลใหม่",
	"Save update data": "คุณต้องการบันทึกการปรับปรุงข้อมูล",
	disable_status: disable_status,
	enable_status: enable_status,
	confirm_disable_status: confirm_disable_status,
	confirm_enable_status: confirm_enable_status,
	"Save updated": "บันทึกปรับปรุงข้อมูลเรียบร้อยแล้ว",
	Domain: Domain,
	Permission: Permission,
	Create_at: Create_at,
	Created_by: Created_by,
	Updated_at: Updated_at,
	Updated_by: Updated_by,
	Description: Description,
	Name: Name,
	"Name for thai": "ชื่อภาษาไทย",
	"Name for english": "ชื่อภาษาอังกฤษ",
	Access: Access,
	Allow: Allow,
	Deny: Deny,
	"Add permission": "เพิ่มการอนุญาต",
	Role: Role,
	"Add role": "เพิ่มบทบาท",
	"Edit permission": "แก้ไขการอนุญาต",
	"Edit role": "แก้ไขบทบาท",
	"Manage role": "จัดการบทบาท",
	"Manage permission": "จัดการการอนุญาต",
	"Available use": "พร้อมใช้งาน",
	"Current role used": "บทบาทที่ใช้อยู่",
	"Current permission used": "การอนุญาตที่ใช้อยู่",
	User: User,
	"Add user": "เพิ่มผู้ใช้งาน",
	Copy: Copy,
	Search: Search,
	Impersonate: Impersonate,
	Settings: Settings,
	Username: Username,
	Email: Email,
	"Phone no": "เบอร์โทรศัพท์",
	Password: Password,
	"Please input the first name!": "กรุณาใส่ชื่อผู้ใช้งาน",
	"Please input the name!": "กรุณาใส่ชื่อ",
	"Please input the email!": "กรุณาใส่อีเมล์",
	"Please input Phone number!": "กรุณาใส่เบอร์โทรศัพท์",
	"Please input password!": "กรุณาใส่รหัสผ่าน",
	"Edit user": "แก้ไขผู้ใช้งาน",
	PIN: PIN,
	"Please input pin number!": "กรุณาใส่เลข Pin จำนวน 6 ตัวและเป็นตัวเลขเท่านั้น",
	"User is duplicate": "ชื่อผู้ใช้งานนี้มีแล้ว กรุณาตรวจสอบ",
	"User profile": "ข้อมูลส่วนตัว",
	"Citizen ID": "เลขประจำตัวประชาชน",
	"Change password": "เปลี่ยนรหัสผ่าน",
	"Confirm password": "ยืนยันรหัสผ่าน",
	"Password is not match": "รหัสผ่านไม่ตรงกัน กรุณาลองใหม่",
	"Pin is already exists": "Pin มีอยู่แล้ว กรุณาตรวจสอบ",
	"Can assign": "สามารถกำหนดสิทธิ์",
	"Information user": "จัดการข้อมูลผู้ใช้งาน",
	"Page not found!!!": "ไม่พบหน้าที่ต้องการ",
	"Confirm delete": "คุณต้องการลบข้อมูล",
	"Delete permission": "ลบข้อมูลการอนุญาต",
	"Delete role": "ลบข้อมูลบทบาท",
	"Data is deleted": "ลบข้อมูลเรียบร้อยแล้ว",
	"Cannot delete data": "ไม่สามารถลบข้อมูลได้",
	"This role has been applied to the user please check": "บทบาทนี้ได้ถูกนำไปใช้กับผู้ใช้งาน กรุณาตรวจสอบ",
	"This role has been applied to the roles please check": "บทบาทนี้ได้ถูกนำไปใช้กับบทบาทอื่นๆ กรุณาตรวจสอบ",
	"This permission has been applied to the roles please check": "บทบาทนี้ได้ถูกนำไปใช้กับบทบาท กรุณาตรวจสอบ",
	"This permission has been applied to the users please check": "บทบาทนี้ได้ถูกนำไปใช้กับผู้ใช้งาน กรุณาตรวจสอบ",
	Properties: Properties
};

var Option$1 = "Option";
var en = {
	Option: Option$1
};

var i18nU = i18n.createInstance();
i18nU.use(initReactI18next).init({
  resources: {
    en: {
      translation: en
    },
    th: {
      translation: th
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var R2D2Store = /*#__PURE__*/function () {
  function R2D2Store() {
    var _this3 = this;

    var _this = this,
        _this2 = this,
        _this4 = this;

    this.init = false;
    this.data = [];
    this.totalItems = 0;
    this.state = 'pending';
    this.fetchSize = 5000;
    this.filter = [];
    this.searchParams = {};
    this.currentPage = 1;
    this.perPage = 10;
    this.totalPage = 100;
    this.isLoading = true;

    this.fetchData = function () {};

    this.handleChangePage = action(function (page) {
      try {
        _this.isLoading = true;
        _this.state = 'pending';
        _this.currentPage = page.current;
        _this.perPage = page.pageSize;

        _this.fetchData();

        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });
    this.handleColumnFilter = action(function (searchColumn, types) {
      try {
        return Promise.resolve(_this2.filter.filter(function (_ref) {
          var searchedColumn = _ref.searchedColumn;
          return searchedColumn !== searchColumn.searchedColumn;
        })).then(function (rmColumnFilter) {
          if (types == 'add') {
            _this2.filter = [].concat(rmColumnFilter, [searchColumn]);
          }

          if (types == 'reset') {
            _this2.filter = [].concat(rmColumnFilter);
            _this2.searchParams = {};
          }

          _this2.filter.forEach(function (ele) {
            _this2.searchParams[ele.searchedColumn] = ele.searchText;
          });

          _this2.fetchData();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

    this.handleResetPage = function () {
      _this3.isLoading = true;
      _this3.state = 'pending';
      _this3.currentPage = 1;
      _this3.filter = [];
      _this3.searchParams = {};

      _this3.fetchData();
    };

    this.setFetchData = action(function (func) {
      try {
        _this4.fetchData = action(function () {
          try {
            var _temp2 = _catch(function () {
              return Promise.resolve(func(_this4.currentPage, _this4.perPage, _this4.searchParams)).then(function (result) {
                runInAction(function () {
                  _this4.setInit(true);

                  _this4.data = [].concat(result.data);
                  _this4.totalItems = result.total_items;
                  _this4.totalPage = result.total_pages;
                  _this4.currentPage = result.cur_pages;
                  _this4.isLoading = false;
                  _this4.state = 'success';
                });
              });
            }, function (e) {
              console.error(e);
              runInAction(function () {
                _this4.setInit(true);

                _this4.isLoading = false;
                _this4.state = 'error';
              });
            });

            return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
          } catch (e) {
            return Promise.reject(e);
          }
        });
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });
    makeObservable(this, {
      init: observable,
      data: observable,
      totalItems: observable,
      state: observable,
      fetchSize: observable,
      filter: observable,
      searchParams: observable,
      currentPage: observable,
      perPage: observable,
      totalPage: observable,
      isLoading: observable,
      setInit: action,
      handleChangePage: action,
      handleResetPage: action,
      handleColumnFilter: action
    });
  }

  var _proto = R2D2Store.prototype;

  _proto.setInit = function setInit(flag) {
    this.init = flag;
  };

  return R2D2Store;
}();

var Store = {
  r2d2Store: new R2D2Store()
};

var StoreContext = React.createContext(null);
var MobxProvider = function MobxProvider(_ref) {
  var store = _ref.store,
      children = _ref.children;
  return /*#__PURE__*/React.createElement(StoreContext.Provider, {
    value: store
  }, children);
};
var useStore = function useStore() {
  var store = React.useContext(StoreContext);

  if (!store) {
    throw new Error('useStore must be used within a MobxProvider.');
  }

  return store;
};

var fake_state = {
  searchedColumn: null,
  searchText: null
};
function R2D2Table(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MobxProvider, {
    store: Store
  }, /*#__PURE__*/React.createElement(LocalTable, props), ";"));
}
var LocalTable = observer(function (props) {
  var _useStore = useStore(),
      r2d2Store = _useStore.r2d2Store;

  var fetchMyAPI = useCallback(function () {
    try {
      r2d2Store.setFetchData(props.fetchData);
      return Promise.resolve(r2d2Store.fetchData()).then(function () {});
    } catch (e) {
      return Promise.reject(e);
    }
  }, []);

  var handleTableChange = function handleTableChange(pagination) {
    try {
      r2d2Store.handleChangePage(pagination);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  useEffect(function () {
    fetchMyAPI();
  }, [fetchMyAPI]);

  var renderColumns = function renderColumns(columns) {
    return columns.map(function (column) {
      if (column.hasOwnProperty('search_params')) {
        column = _extends({}, column, getColumnSearchProps(column.dataIndex, column.search_params, column.title));
      }

      return column;
    });
  };

  var getColumnSearchProps = function getColumnSearchProps(dataIndex, search_params, title) {
    return {
      filterDropdown: function filterDropdown(_ref) {
        var setSelectedKeys = _ref.setSelectedKeys,
            selectedKeys = _ref.selectedKeys,
            confirm = _ref.confirm,
            clearFilters = _ref.clearFilters;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 8
          }
        }, searchRender({
          selectedKeys: selectedKeys,
          handleSearch: handleSearch,
          setSelectedKeys: setSelectedKeys,
          search_params: search_params,
          title: title
        }), /*#__PURE__*/React.createElement(Button, {
          type: "primary",
          onClick: function onClick() {
            return handleSearch(selectedKeys, confirm, search_params, title);
          },
          icon: /*#__PURE__*/React.createElement(SearchOutlined, null),
          size: "small",
          style: {
            width: 90,
            marginRight: 8
          }
        }, "Search"), /*#__PURE__*/React.createElement(Button, {
          onClick: function onClick() {
            return handleReset(selectedKeys, clearFilters, search_params);
          },
          size: "small",
          style: {
            width: 90
          }
        }, "Reset"));
      },
      filterIcon: function filterIcon(filtered) {
        return /*#__PURE__*/React.createElement(SearchOutlined, {
          style: {
            color: filtered ? '#1890ff' : undefined
          }
        });
      }
    };
  };

  var handleReset = function handleReset(selectedKeys, clearFilters, dataIndex) {
    fake_state['searchText'] = selectedKeys[0];
    fake_state['searchedColumn'] = dataIndex;
    r2d2Store.handleColumnFilter(fake_state, 'reset');
    clearFilters();
  };

  var searchRender = function searchRender(_ref2) {
    var selectedKeys = _ref2.selectedKeys,
        handleSearch = _ref2.handleSearch,
        setSelectedKeys = _ref2.setSelectedKeys,
        search_params = _ref2.search_params,
        title = _ref2.title;
    return /*#__PURE__*/React.createElement(Input, {
      ref: function ref(node) {
      },
      placeholder: "Search " + title,
      value: selectedKeys[0],
      onChange: function onChange(e) {
        return setSelectedKeys(e.target.value ? [e.target.value] : []);
      },
      onPressEnter: function onPressEnter() {
        return handleSearch(selectedKeys, confirm, search_params, title);
      },
      style: {
        width: 188,
        marginBottom: 8,
        display: 'block'
      }
    });
  };

  var handleSearch = function handleSearch(selectedKeys, confirm, search_params, title) {
    try {
      fake_state['searchText'] = selectedKeys[0].replace(/\s+$/, '');
      fake_state['searchText'] = selectedKeys[0];
      fake_state['searchedColumn'] = search_params;
      fake_state['title'] = title;
      r2d2Store.handleColumnFilter(fake_state, 'add');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var columns = props.columns,
      rest = _objectWithoutPropertiesLoose(props, ["columns"]);

  if (props.scrollAuto) {
    var autoCalculateWith = columns.length * 200;
    rest = _extends({
      scroll: {
        x: autoCalculateWith
      }
    }, rest);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FilterBar, null), /*#__PURE__*/React.createElement(Table, _extends({
    dataSource: r2d2Store.data,
    columns: renderColumns(columns),
    loading: !r2d2Store.init && r2d2Store.isLoading,
    pagination: {
      position: ['bottomRight', 'none'],
      pageSize: r2d2Store.perPage,
      current: r2d2Store.currentPage,
      total: r2d2Store.totalItems
    },
    onChange: handleTableChange
  }, rest)));
});
var FilterBar = observer(function () {
  var _useStore2 = useStore(),
      r2d2Store = _useStore2.r2d2Store;

  var handleReset = function handleReset(selectedKeys, clearFilters, dataIndex) {
    fake_state['searchText'] = selectedKeys[0];
    fake_state['searchedColumn'] = dataIndex;
    r2d2Store.handleColumnFilter(fake_state, 'reset');
    clearFilters();
  };

  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '62px',
      borderRadius: '18px',
      backgroundColor: 'rgb(205 219 81 / 24%)',
      borderStyle: 'dashed',
      borderWidth: '3px',
      borderColor: 'rgb(220 26 26 / 72%)',
      marginBottom: '12px',
      alignItems: 'center',
      display: r2d2Store.filter.length ? 'flex' : 'none',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Row, {
    align: "center"
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      marginLeft: '16px'
    }
  }, "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E42\u0E14\u0E22 : "), r2d2Store.filter.map(function (element) {
    return /*#__PURE__*/React.createElement("div", {
      key: element.searchedColumn,
      style: {
        marginLeft: '10px',
        paddingInline: '8px',
        backgroundColor: 'rgb(122 252 210 / 52%)',
        borderRadius: '12px'
      }
    }, /*#__PURE__*/React.createElement("div", null, element.title, ' : ', element.searchText, ' ', /*#__PURE__*/React.createElement(CloseCircleTwoTone, {
      onClick: function onClick() {
        return handleReset(element.searchText, function () {}, element.searchedColumn);
      },
      twoToneColor: "#eb2f96"
    }), ' '));
  })), /*#__PURE__*/React.createElement(Button, {
    danger: true,
    type: "link",
    onClick: function onClick() {
      return r2d2Store.handleResetPage();
    },
    size: "small",
    style: {
      width: 90,
      marginRight: 8
    }
  }, "\u0E40\u0E04\u0E25\u0E35\u0E22\u0E23\u0E4C\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14"));
});

var TableStore = /*#__PURE__*/function () {
  function TableStore() {
    var _this2 = this;

    var _this = this;

    this.init = false;
    this.data = [];
    this.totalItems = 0;
    this.state = 'pending';
    this.rowKey = '';
    this.fetchSize = 5000;
    this.filter = [];
    this.searchParams = {};
    this.currentPage = 1;
    this.perPage = 10;
    this.totalPage = 100;
    this.isLoading = true;

    this.fetchData = function () {};

    this.currentRecord = null;
    this.primaryKey = null;
    this.ActionComponent = null;
    this.actionView = null;
    this.actionTitle = null;
    this.actionWidth = null;
    this.actionFormVisible = false;

    this.getRecord = function () {};

    this.readRecord = function () {};

    this.statusRecord = function () {};

    this.updateRecord = function () {};

    this.createRecord = function () {};

    this.deleteRecord = function () {};

    this.bulkActionRecord = function () {};

    this.bulkActionSelected = [];
    this.headerStatus = {};

    this.setPage = function (_page) {
      _this.perPage = _page;
    };

    this.handleChangePage = action(function (page) {
      _this.isLoading = true;
      _this.state = 'pending';
      _this.currentPage = page.current;
      _this.perPage = page.pageSize;

      _this.fetchData();
    });
    this.handleColumnFilter = action(function (searchColumn, types) {
      _this.currentPage = 1;
      _this.bulkActionSelected = [];

      var rmColumnFilter = _this.filter.filter(function (_ref) {
        var searchedColumn = _ref.searchedColumn;
        return searchedColumn !== searchColumn.searchedColumn;
      });

      if (types == 'add') {
        _this.filter = [].concat(rmColumnFilter, [searchColumn]);
      }

      if (types == 'reset') {
        _this.filter = [].concat(rmColumnFilter);
        _this.searchParams = {};
      }

      _this.filter.forEach(function (ele) {
        _this.searchParams[ele.searchedColumn] = ele.searchText;
      });

      if (_this.headerStatus) if (Object.keys(_this.headerStatus).length) _this.searchParams = _extends({}, _this.searchParams, _this.headerStatus);

      _this.fetchData();
    });

    this.handleResetPage = function () {
      _this.isLoading = true;
      _this.state = 'pending';
      _this.currentPage = 1;
      _this.bulkActionSelected = [];
      _this.filter = [];
      _this.searchParams = {};
      _this.headerStatus = null;

      _this.fetchData();
    };

    this.setFetchData = action(function (func) {
      try {
        _this2.fetchData = action(function () {
          try {
            var _temp4 = _catch(function () {
              _this2.isLoading = true;
              var self = _this2;

              function delayFetch() {
                return new Promise(function (resolve, reject) {
                  setTimeout(function () {
                    resolve(func(self.currentPage, self.perPage, self.searchParams));
                  }, 0);
                });
              }

              console.log(_this2.currentPage);
              return Promise.resolve(delayFetch()).then(function (result) {
                function _temp2() {
                  runInAction(function () {
                    _this2.setInit(true);

                    _this2.data = [].concat(result.data);
                    _this2.totalItems = result.total_items;
                    _this2.totalPage = result.total_pages;
                    _this2.currentPage = result.cur_pages;
                    _this2.isLoading = false;
                    _this2.state = 'success';
                  });
                }

                console.log(result.cur_pages - 1);

                var _temp = function () {
                  if (result.data.length === 0 && result.cur_pages - 1 !== 0) {
                    return Promise.resolve(func(result.cur_pages - 1, _this2.perPage, _this2.searchParams)).then(function (_func) {
                      result = _func;
                    });
                  }
                }();

                return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
              });
            }, function (e) {
              console.error(e);
              runInAction(function () {
                _this2.setInit(true);

                _this2.isLoading = false;
                _this2.state = 'error';
              });
            });

            return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(function () {}) : void 0);
          } catch (e) {
            return Promise.reject(e);
          }
        });
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });

    this.setCurrentRecord = function (_record) {
      _this.currentRecord = _record;
    };

    this.setPrimaryKey = function (_key) {
      _this.primaryKey = _key;
    };

    this.setComponent = function (component, view, title, width) {
      if (width === void 0) {
        width = '50%';
      }

      if (component) {
        _this.ActionComponent = component;
        _this.actionView = view;
        _this.actionTitle = title;
        _this.actionWidth = width;

        _this.setModalVisibility(true);
      }
    };

    this.setModalVisibility = action(function (_visibility) {
      _this.actionFormVisible = _visibility;
    });

    this.setGetRecordHandler = function (func) {
      _this.getRecord = function () {
        try {
          return Promise.resolve(_catch(function () {
            return Promise.resolve(func(_this.primaryKey)).then(function (record) {
              return Promise.resolve(runInAction(function () {
                _this.currentRecord = record;
              })).then(function () {
                return record;
              });
            });
          }, function () {
            runInAction(function () {
              _this.isLoading = false;
            });
          }));
        } catch (e) {
          return Promise.reject(e);
        }
      };
    };

    this.setReadRecordHandler = function (func) {
      _this.readRecord = action(function (record) {
        try {
          return Promise.resolve(func(record)).then(function () {
            runInAction(function () {
              _this.isLoading = false;

              _this.setModalVisibility(false);

              _this.fetchData();
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
    };

    this.setUpdateRecordHandler = function (func) {
      _this.updateRecord = action(function (record) {
        try {
          return Promise.resolve(func(record)).then(function () {
            runInAction(function () {
              _this.setModalVisibility(false);

              _this.fetchData();
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
    };

    this.setUpdateStatusHandler = function (func) {
      _this.statusRecord = action(function (record) {
        try {
          return Promise.resolve(func(record)).then(function () {
            runInAction(function () {
              _this.isLoading = false;

              _this.setModalVisibility(false);

              _this.fetchData();
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
    };

    this.setCreateRecordHandler = function (func) {
      _this.createRecord = action(function (record) {
        try {
          return Promise.resolve(func(record)).then(function () {
            runInAction(function () {
              _this.isLoading = false;

              _this.setModalVisibility(false);

              _this.fetchData();
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
    };

    this.setDeleteRecordHandler = function (func) {
      _this.deleteRecord = action(function (record) {
        try {
          return Promise.resolve(func(record)).then(function () {
            runInAction(function () {
              _this.isLoading = false;

              _this.setModalVisibility(false);

              _this.fetchData();
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
    };

    this.setBulkActionHandler = function (func) {
      _this.bulkActionRecord = action(function (key) {
        try {
          var _temp6 = _catch(function () {
            var records = _this.bulkActionSelected;
            return Promise.resolve(func(records, key)).then(function () {
              runInAction(function () {
                _this.isLoading = false;
                _this.bulkActionSelected = [];

                _this.setModalVisibility(false);

                _this.fetchData();
              });
            });
          }, function (e) {
            console.log(e);
            runInAction(function () {
              message.error(e);
              _this.isLoading = false;

              _this.setModalVisibility(false);
            });
          });

          return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(function () {}) : void 0);
        } catch (e) {
          return Promise.reject(e);
        }
      });
    };

    this.setBulkActionSelected = function (recordSelected) {
      var keyInPage = _this.data.map(function (e) {
        return e[_this.rowKey];
      });

      var keySelectedInPage = _this.data.filter(function (e) {
        return recordSelected.includes(e[_this.rowKey]);
      });

      var getKeyMergeSelectedInPage = keySelectedInPage.map(function (e) {
        return e[_this.rowKey];
      });

      var keepKeyOtherPage = _this.bulkActionSelected.filter(function (e) {
        return !keyInPage.includes(e);
      });

      _this.bulkActionSelected = [].concat(keepKeyOtherPage, getKeyMergeSelectedInPage);
    };

    this.handleResetBulkActionSelected = function (key) {
      if (key) {
        _this.bulkActionSelected = _this.bulkActionSelected.filter(function (e) {
          return e !== key;
        });
      } else {
        _this.bulkActionSelected = [];
      }
    };

    this.setSearchParams = function (_params) {
      if (_params === void 0) {
        _params = {};
      }

      _this.searchParams = _extends({}, _params);
    };

    this.setHeaderStatus = function (_status) {
      if (_status === void 0) {
        _status = null;
      }

      _this.bulkActionSelected = [];
      _this.headerStatus = _status;
    };

    this.resetTableStore = function () {
      _this.init = false;
      _this.data = [];
      _this.totalItems = 0;
      _this.state = 'pending';
      _this.rowKey = '';
      _this.fetchSize = 5000;
      _this.filter = [];
      _this.searchParams = {};
      _this.currentPage = 1;
      _this.perPage = 10;
      _this.totalPage = 100;
      _this.isLoading = true;

      _this.fetchData = function () {};

      _this.currentRecord = null;
      _this.primaryKey = null;
      _this.ActionComponent = null;
      _this.actionView = null;
      _this.actionTitle = null;
      _this.actionWidth = null;
      _this.actionFormVisible = false;

      _this.getRecord = function () {};

      _this.readRecord = function () {};

      _this.statusRecord = function () {};

      _this.updateRecord = function () {};

      _this.createRecord = function () {};

      _this.deleteRecord = function () {};

      _this.bulkActionRecord = function () {};

      _this.bulkActionSelected = [];
      _this.headerStatus = {};
    };

    makeObservable(this, {
      init: observable,
      data: observable,
      totalItems: observable,
      state: observable,
      rowKey: observable,
      fetchSize: observable,
      filter: observable,
      searchParams: observable,
      currentPage: observable,
      perPage: observable,
      totalPage: observable,
      isLoading: observable,
      currentRecord: observable,
      primaryKey: observable,
      ActionComponent: observable,
      actionView: observable,
      actionTitle: observable,
      actionWidth: observable,
      actionFormVisible: observable,
      getRecord: observable,
      readRecord: observable,
      statusRecord: observable,
      updateRecord: observable,
      createRecord: observable,
      deleteRecord: observable,
      bulkActionRecord: observable,
      bulkActionSelected: observable,
      setBulkActionHandler: action,
      setBulkActionSelected: action,
      handleResetBulkActionSelected: action,
      setRowKey: action,
      setModalVisibility: action,
      setComponent: action,
      setInit: action,
      handleChangePage: action,
      handleResetPage: action,
      handleColumnFilter: action,
      setCurrentRecord: action,
      setPrimaryKey: action,
      setPage: action,
      setGetRecordHandler: action,
      setReadRecordHandler: action,
      setUpdateRecordHandler: action,
      setUpdateStatusHandler: action,
      setCreateRecordHandler: action,
      setDeleteRecordHandler: action,
      setSearchParams: action,
      setFilter: action,
      headerStatus: observable,
      setHeaderStatus: action,
      resetTableStore: action
    });
  }

  var _proto = TableStore.prototype;

  _proto.setInit = function setInit(flag) {
    this.init = flag;
  };

  _proto.setRowKey = function setRowKey(_key) {
    this.rowKey = _key;
  };

  _proto.setFilter = function setFilter(_filter) {
    if (_filter === void 0) {
      _filter = [];
    }

    this.filter = [].concat(_filter);
  };

  return TableStore;
}();

var Store$1 = {
  tableStore: new TableStore()
};

var ActionDropDown = React.memo(function (_ref) {
  var data = _ref.data,
      record = _ref.record,
      text = _ref.text;
  var menu = /*#__PURE__*/React.createElement(Menu, null, data.map(function (Component) {
    return /*#__PURE__*/React.createElement(Menu.Item, {
      key: Component.key,
      icon: /*#__PURE__*/React.createElement(Component.Icon, null),
      onClick: function onClick() {
        return Component.onClick(record);
      },
      disabled: Component.setDisable(record)
    }, Component.text);
  }));
  return /*#__PURE__*/React.createElement(Dropdown, {
    overlay: menu
  }, /*#__PURE__*/React.createElement(Button, null, text, " ", /*#__PURE__*/React.createElement(DownOutlined, null)));
});

var ActionButtonGroup = React.memo(function (_ref) {
  var data = _ref.data,
      record = _ref.record;
  return data.map(function (Component) {
    return /*#__PURE__*/React.createElement(Button, {
      type: Component.type,
      key: Component.key,
      icon: /*#__PURE__*/React.createElement(Component.Icon, null),
      onClick: function onClick() {
        return Component.onClick(record);
      }
    }, Component.text);
  });
});

var fake_state$1 = {
  searchedColumn: null,
  searchText: null
};
function C3POTable(props) {
  return /*#__PURE__*/React.createElement(MobxProvider, {
    store: Store$1
  }, /*#__PURE__*/React.createElement(LocalTable$1, props));
}
var RenderForm = observer(function () {
  var _useStore = useStore(),
      tableStore = _useStore.tableStore;

  if (tableStore.ActionComponent && React.isValidElement(tableStore.ActionComponent) && typeof tableStore.ActionComponent.type === 'function') {
    tableStore.ActionComponent.props.key = tableStore.primaryKey;

    tableStore.ActionComponent.props.close = function () {
      return tableStore.setModalVisibility(false);
    };

    tableStore.ActionComponent.props.getHandler = tableStore.getRecord;

    if (tableStore.ActionComponent.props.mode === 'read') {
      tableStore.ActionComponent.props.saveHandler = tableStore.readRecord;
    } else if (tableStore.ActionComponent.props.mode === 'update-status') {
      tableStore.ActionComponent.props.saveHandler = tableStore.statusRecord;
    } else if (tableStore.ActionComponent.props.mode === 'edit') {
      tableStore.ActionComponent.props.saveHandler = tableStore.updateRecord;
    } else if (tableStore.ActionComponent.props.mode === 'delete') {
      tableStore.ActionComponent.props.saveHandler = tableStore.deleteRecord;
    } else {
      tableStore.ActionComponent.props.saveHandler = tableStore.createRecord;
    }
  }

  if (tableStore.actionView === 'drawer') {
    return /*#__PURE__*/React.createElement(Drawer, {
      width: tableStore.actionWidth,
      closable: true,
      destroyOnClose: true,
      visible: tableStore.actionFormVisible,
      title: tableStore.actionTitle,
      onClose: function onClose() {
        tableStore.setModalVisibility(false);
      }
    }, tableStore.ActionComponent);
  } else if (tableStore.actionView === 'modal') {
    return /*#__PURE__*/React.createElement(Modal, {
      width: tableStore.actionWidth,
      title: tableStore.actionTitle,
      visible: tableStore.actionFormVisible,
      closable: true,
      destroyOnClose: true,
      footer: null,
      onCancel: function onCancel() {
        return tableStore.setModalVisibility(false);
      }
    }, tableStore.ActionComponent);
  } else {
    return tableStore.ActionComponent;
  }
});
var LocalTable$1 = observer(function (props) {
  var _useStore2 = useStore(),
      tableStore = _useStore2.tableStore;

  var fetchMyAPI = useCallback(function () {
    try {
      tableStore.setFetchData(props.fetchData);
      tableStore.setGetRecordHandler(props.getRecord);
      tableStore.setReadRecordHandler(props.readRecord);
      tableStore.setUpdateRecordHandler(props.updateRecord);
      tableStore.setUpdateStatusHandler(props.statusRecord);
      tableStore.setDeleteRecordHandler(props.deleteRecord);
      tableStore.setRowKey(props.rowKey);
      tableStore.setPage(props.perPage ? props.perPage : 10);
      tableStore.setBulkActionHandler(props.bulkActionRecord);
      return Promise.resolve(tableStore.fetchData()).then(function () {});
    } catch (e) {
      return Promise.reject(e);
    }
  }, [props.c3poKey]);

  var handleTableChange = function handleTableChange(pagination) {
    try {
      tableStore.handleChangePage(pagination);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  useEffect(function () {
    fetchMyAPI();
    return function () {
      tableStore.resetTableStore();
    };
  }, [fetchMyAPI]);
  var ActionButton = observer(function (props) {
    var type = props.type;

    if (type === 'dropdown') {
      return /*#__PURE__*/React.createElement(ActionDropDown, props);
    } else {
      return /*#__PURE__*/React.createElement(ActionButtonGroup, props);
    }
  });

  var renderColumns = function renderColumns(columns) {
    if (columns) {
      return columns.map(function (column) {
        if (column.hasOwnProperty('search_params')) {
          column = _extends({}, column, getColumnSearchProps(column.dataIndex, column.search_params, column.title));
        }

        if (column.action && column.action.length) {
          var _column = column,
              _rest = _objectWithoutPropertiesLoose(_column, ["action"]);

          var _render = [];
          column.action.forEach(function (action) {
            if (!action.setDisable) {
              action.setDisable = function () {
                return false;
              };
            }

            var Icon;

            var onClick = function onClick(record) {
              tableStore.setCurrentRecord(record);
              tableStore.setPrimaryKey(props.primaryKey(record));

              if (action.component) {
                tableStore.setComponent(action.component, action.view, action.title, action.width);
              }
            };

            switch (action.type) {
              case 'inlineEdit':
                Icon = EditOutlined || action.icon;
                break;

              case 'edit':
                Icon = EditFilled || action.icon;
                break;

              case 'view':
                Icon = EyeFilled || action.icon;
                break;

              case 'delete':
                Icon = DeleteFilled || action.icon;
                break;

              case 'read':
                Icon = ReadOutlined || action.icon;
                break;

              case 'update-status':
                Icon = UnlockOutlined || action.icon;
                break;

              default:
                Icon = null;
            }

            _render.push({
              type: 'default',
              key: action.type,
              Icon: Icon,
              text: action.text ? action.text : null,
              setDisable: action.setDisable,
              onClick: onClick
            });
          });
          return _extends({}, _rest, {
            render: function render(text, record, index) {
              return /*#__PURE__*/React.createElement(ActionButton, {
                type: props.actionComponent,
                data: _render,
                record: record,
                text: props.dropdownText
              });
            }
          });
        }

        return column;
      });
    }

    return [];
  };

  var getColumnSearchProps = function getColumnSearchProps(dataIndex, search_params, title) {
    return {
      filterDropdown: function filterDropdown(_ref) {
        var setSelectedKeys = _ref.setSelectedKeys,
            selectedKeys = _ref.selectedKeys,
            confirm = _ref.confirm,
            clearFilters = _ref.clearFilters;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 8
          }
        }, searchRender({
          selectedKeys: selectedKeys,
          handleSearch: handleSearch,
          setSelectedKeys: setSelectedKeys,
          search_params: search_params,
          title: title
        }), /*#__PURE__*/React.createElement(Button, {
          type: "primary",
          onClick: function onClick() {
            return handleSearch(selectedKeys, confirm, search_params, title);
          },
          icon: /*#__PURE__*/React.createElement(SearchOutlined, null),
          size: "small",
          style: {
            width: 90,
            marginRight: 8
          }
        }, "Search"), /*#__PURE__*/React.createElement(Button, {
          onClick: function onClick() {
            return handleReset(selectedKeys, clearFilters, search_params);
          },
          size: "small",
          style: {
            width: 90
          }
        }, "Reset"));
      },
      filterIcon: function filterIcon(filtered) {
        return /*#__PURE__*/React.createElement(SearchOutlined, {
          style: {
            color: filtered ? '#1890ff' : undefined
          }
        });
      }
    };
  };

  var handleReset = function handleReset(selectedKeys, clearFilters, dataIndex) {
    fake_state$1['searchText'] = selectedKeys[0];
    fake_state$1['searchedColumn'] = dataIndex;
    tableStore.handleColumnFilter(fake_state$1, 'reset');
    clearFilters();
  };

  var searchRender = function searchRender(_ref2) {
    var selectedKeys = _ref2.selectedKeys,
        handleSearch = _ref2.handleSearch,
        setSelectedKeys = _ref2.setSelectedKeys,
        search_params = _ref2.search_params,
        title = _ref2.title;
    return /*#__PURE__*/React.createElement(Input, {
      ref: function ref(node) {
      },
      placeholder: "Search " + title,
      value: selectedKeys[0],
      onChange: function onChange(e) {
        return setSelectedKeys(e.target.value ? [e.target.value] : []);
      },
      onPressEnter: function onPressEnter() {
        return handleSearch(selectedKeys, confirm, search_params, title);
      },
      style: {
        width: 188,
        marginBottom: 8,
        display: 'block'
      }
    });
  };

  var handleSearch = function handleSearch(selectedKeys, confirm, search_params, title) {
    try {
      fake_state$1['searchText'] = selectedKeys[0].replace(/\s+$/, '');
      fake_state$1['searchText'] = selectedKeys[0];
      fake_state$1['searchedColumn'] = search_params;
      fake_state$1['title'] = title;
      tableStore.handleColumnFilter(fake_state$1, 'add');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var columns = props.columns,
      rest = _objectWithoutPropertiesLoose(props, ["columns"]);

  if (props.scrollAuto) {
    var autoCalculateWith = columns.length * 200;
    rest = _extends({
      scroll: {
        x: autoCalculateWith
      }
    }, rest);
  }

  if (props.expandableRows) {
    rest = _extends({
      expandable: {
        expandedRowRender: function expandedRowRender(record) {
          var item = [];
          props.expandableRows.forEach(function (element, i) {
            item.push( /*#__PURE__*/React.createElement(Descriptions.Item, {
              bordered: true,
              key: i + record[props.rowKey],
              label: element.title,
              labelStyle: {
                fontWeight: '600'
              },
              span: Object.keys('span').length === 0 ? 1 : element.span,
              style: {
                border: '1px solid lightgray',
                borderSpacing: '1px 1px'
              }
            }, record[element.key]));
          });
          return /*#__PURE__*/React.createElement("div", {
            style: {
              display: 'flex',
              justifyContent: 'center'
            }
          }, /*#__PURE__*/React.createElement(Descriptions, {
            bordered: true,
            key: record[props.rowKey],
            title: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21"
          }, item));
        }
      }
    }, rest);
  }

  var bulkActionSelected = tableStore.bulkActionSelected,
      setBulkActionSelected = tableStore.setBulkActionSelected;
  var rowSelection = {
    selectedRowKeys: [].concat(bulkActionSelected),
    onChange: setBulkActionSelected,
    hideSelectAll: true
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RenderForm, null), /*#__PURE__*/React.createElement(HeaderTable, {
    bulk: props.bulkAction,
    filter: props.queryHeader
  }), /*#__PURE__*/React.createElement(FilterBar$1, null), /*#__PURE__*/React.createElement(Table, _extends({
    rowSelection: props.rowKey && props.rowSelect ? rowSelection : false,
    dataSource: tableStore.data,
    columns: renderColumns(columns),
    loading: !tableStore.init || tableStore.isLoading,
    pagination: {
      position: ['bottomRight', 'none'],
      pageSize: tableStore.perPage,
      current: tableStore.currentPage,
      total: tableStore.totalItems
    },
    onChange: handleTableChange
  }, rest)));
});
var FilterBar$1 = observer(function () {
  var _useStore3 = useStore(),
      tableStore = _useStore3.tableStore;

  var handleReset = function handleReset(selectedKeys, clearFilters, dataIndex) {
    fake_state$1['searchText'] = selectedKeys[0];
    fake_state$1['searchedColumn'] = dataIndex;
    tableStore.handleColumnFilter(fake_state$1, 'reset');
    clearFilters();
  };

  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '62px',
      borderRadius: '18px',
      backgroundColor: 'rgb(205 219 81 / 24%)',
      borderStyle: 'dashed',
      borderWidth: '3px',
      borderColor: 'rgb(220 26 26 / 72%)',
      marginBottom: '12px',
      alignItems: 'center',
      display: tableStore.filter.length ? 'flex' : 'none',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Row, {
    align: "center"
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      marginLeft: '16px'
    }
  }, "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E42\u0E14\u0E22 : "), tableStore.filter.map(function (element) {
    return /*#__PURE__*/React.createElement("div", {
      key: element.searchedColumn,
      style: {
        marginLeft: '10px',
        paddingInline: '8px',
        backgroundColor: 'rgb(122 252 210 / 52%)',
        borderRadius: '12px'
      }
    }, /*#__PURE__*/React.createElement("div", null, element.title, ' : ', element.searchText, ' ', /*#__PURE__*/React.createElement(CloseCircleTwoTone, {
      key: element.searchedColumn,
      onClick: function onClick() {
        return handleReset(element.searchText, function () {}, element.searchedColumn);
      },
      twoToneColor: "#eb2f96"
    }), ' '));
  })), /*#__PURE__*/React.createElement(Button, {
    danger: true,
    type: "link",
    onClick: function onClick() {
      return tableStore.handleResetPage();
    },
    size: "small",
    style: {
      width: 90,
      marginRight: 8
    }
  }, "\u0E40\u0E04\u0E25\u0E35\u0E22\u0E23\u0E4C\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14"));
});
var HeaderTable = observer(function (_ref3) {
  var bulk = _ref3.bulk,
      filter = _ref3.filter;

  var _useStore4 = useStore(),
      tableStore = _useStore4.tableStore;

  var handleBulkActionOnClick = function handleBulkActionOnClick(_ref4) {
    var key = _ref4.key;
    tableStore.bulkActionRecord(key);
  };

  var FilterButton = function FilterButton() {
    var render = [];

    if (filter) {
      filter.forEach(function (E) {
        if (E.type === 'button') {
          render.push( /*#__PURE__*/React.createElement(Button, {
            key: E.label,
            icon: /*#__PURE__*/React.createElement(E.icon, null),
            onClick: function onClick() {
              var filter = [];
              Object.keys(E.queryParams).forEach(function (key) {
                filter.push({
                  searchText: E.queryParams[key],
                  searchedColumn: key,
                  title: E.label
                });
              });
              tableStore.setBulkActionSelected([]);
              tableStore.setFilter([].concat(filter));
              tableStore.setSearchParams(_extends({}, E.queryParams, tableStore.headerStatus));
              tableStore.fetchData();
            }
          }, E.label));
        }

        if (E.type === 'options') {
          render.push( /*#__PURE__*/React.createElement(E.component, {
            key: E.key,
            saveHandler: function saveHandler(val) {
              var req = {};
              req[E.params] = val;
              tableStore.setHeaderStatus(_extends({}, tableStore.headerStatus, req));
              tableStore.setSearchParams(_extends({}, tableStore.searchParams, req));
              tableStore.fetchData();
            },
            onUpdateValue: tableStore.headerStatus === null ? null : tableStore.headerStatus[E.params],
            onClear: function onClear() {
              var clearParams = E.params;
              var headerStatus = tableStore.headerStatus;
              delete headerStatus[clearParams];
              tableStore.setHeaderStatus(_extends({}, headerStatus));
            }
          }));
        }
      });
    }

    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: '12px'
      }
    }, render);
  };

  var BulkButton = function BulkButton() {
    var menu = {
      "if": function _if(bulk) {
        return /*#__PURE__*/React.createElement(Menu, {
          onClick: handleBulkActionOnClick
        }, bulk.options.map(function (e) {
          return /*#__PURE__*/React.createElement(Menu.Item, {
            key: e.value,
            icon: /*#__PURE__*/React.createElement(e.icon, null),
            disabled: e.disabled ? e.disabled : false
          }, e.label);
        }));
      }
    };

    if (bulk) {
      return /*#__PURE__*/React.createElement(Dropdown, {
        overlay: menu,
        placement: "bottomLeft",
        arrow: true,
        disabled: !tableStore.bulkActionSelected.length
      }, /*#__PURE__*/React.createElement(Button, null, bulk.ButtonName));
    } else {
      return /*#__PURE__*/React.createElement("div", null);
    }
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: bulk && filter.length ? 'flex' : 'none',
      justifyContent: 'space-between',
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement(BulkButton, null), /*#__PURE__*/React.createElement("div", null, FilterButton())), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '62px',
      borderRadius: '18px',
      backgroundColor: '#cde7fc',
      borderStyle: 'dashed',
      borderWidth: '3px',
      borderColor: 'rgb(220 26 26 / 72%)',
      marginBottom: '12px',
      alignItems: 'center',
      display: tableStore.bulkActionSelected.length ? 'flex' : 'none',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Row, {
    align: "center"
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      marginLeft: '16px'
    }
  }, "Selected Total " + tableStore.bulkActionSelected.length + " Records"), tableStore.bulkActionSelected.map(function (element) {
    return /*#__PURE__*/React.createElement("div", {
      key: element,
      style: {
        marginLeft: '10px',
        paddingInline: '8px',
        backgroundColor: 'rgb(122 252 210 / 52%)',
        borderRadius: '12px'
      }
    }, /*#__PURE__*/React.createElement("div", null, tableStore.rowKey, ' : ', element, ' ', /*#__PURE__*/React.createElement(CloseCircleTwoTone, {
      onClick: function onClick() {
        return tableStore.handleResetBulkActionSelected(element);
      },
      twoToneColor: "#eb2f96"
    }), ' '));
  })), /*#__PURE__*/React.createElement(Button, {
    danger: true,
    type: "link",
    onClick: function onClick() {
      return tableStore.handleResetBulkActionSelected();
    },
    size: "small",
    style: {
      width: 90,
      marginRight: 8
    }
  }, "\u0E40\u0E04\u0E25\u0E35\u0E22\u0E23\u0E4C\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14")));
});

var R2D2Table$1 = function R2D2Table$1(props) {
  props.language && i18nU.addResourceBundle(props.lang, 'translation', props.language);
  return /*#__PURE__*/React.createElement(I18nextProvider, {
    i18n: i18nU
  }, /*#__PURE__*/React.createElement(ConfigProvider, {
    locale: props.lang === 'th' ? thTH : enUS
  }, /*#__PURE__*/React.createElement(R2D2Table, props)));
};
var C3POTable$1 = function C3POTable$1(props) {
  props.language && i18nU.addResourceBundle(props.lang, 'translation', props.language);
  return /*#__PURE__*/React.createElement("div", {
    key: props.c3poKey
  }, /*#__PURE__*/React.createElement(I18nextProvider, {
    i18n: i18nU
  }, /*#__PURE__*/React.createElement(ConfigProvider, {
    locale: props.lang === 'th' ? thTH : enUS
  }, /*#__PURE__*/React.createElement(C3POTable, props))));
};

export { C3POTable$1 as C3POTable, R2D2Table$1 as R2D2Table };
//# sourceMappingURL=index.modern.js.map
