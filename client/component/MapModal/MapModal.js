import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button, Modal, Space, Spin, Tag } from "antd";
import MyMapWithAutocomplete from "./MapWithASearchBox";
import { useTranslation } from "react-i18next";
import { EditOutlined } from "@ant-design/icons";

export const MapForm = ({ onChange, value }) => {
  const { t } = useTranslation();
  const [ visible, setVisible ] = useState(false)
  const [ place, setPlace ] = useState({})

  useEffect(() => {
    if(value?.location?.lat && value?.location?.lng) {
      setPlace({
        location: value.location
      })
    } 
  },[value])

  const handleChange = (placeData) => {
    setPlace(placeData)
    onChange(placeData)
  }

  const closeModal = () => setVisible(false)

  if(!visible && place?.location?.lat && place?.location?.lng) {
    return (
      <>
        <Space align="center">
          <div style={{ color: "darkblue", fontSize: "bold"}}>{place.location.lat}</div>
          <div style={{ color: "darkgreen", fontSize: "bold", marginLeft: 6 }}>{place.location.lng}</div>
          <Tag 
            icon={<EditOutlined />} 
            color="default"
            onClick={() => setVisible(true)}
          >
            {t("Edit")}
          </Tag>
        </Space>
      </>
    )
  }

  return (
    <>
      <Button onClick={() => setVisible(true)}>
        {t("store:Select The Place Location")}
      </Button>
      {place && <MapModal onSelect={handleChange} initPlace={place} visible={visible} setVisible={closeModal} />}
    </>
  )
}


export const MapModal = ({ onSelect, visible, setVisible, initPlace }) => {
  const { t } = useTranslation();
  const [ place, setPlace ] = useState({})

  useEffect(() => {
    setPlace(initPlace)
  },[])

  /* on MyMapWithAutocomplete callback */
  const onMapCallback = ({location, type, ...other}) => {
    setPlace({location, type, ...other})
  };

  const handleOk = () => {
    if(Object.entries(place).length) {
      if(typeof(onSelect) === 'function') {
        onSelect(place)
      }
    }
    setVisible(false)
  }

  const handleCancel = () => {
    setVisible(false)
  }


  return (
    <Modal
      title={t("store:Select The Place Location")}
      visible={visible}
      closable
      // destroyOnClose
      width={"850px"}
      onOk={handleOk} 
      onCancel={handleCancel}
      okText={t("Select")}
      cancelText={t("Cancel")}
    >
      {place && <MyMapWithAutocomplete initData={place} onPlaceChanged={onMapCallback} searchBoxText={t("store:Type for search the place")} />}
    </Modal>
  );
};
