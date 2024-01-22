import React from "react";
import { GoogleMap, LoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import { Spin } from "antd";

const mapContainerStyle = {
  height: "400px",
  width: "800px",
};

const mapFeature = ["places"]
class MyMapWithAutocomplete extends React.Component {
    constructor(props) {
        super(props);
        this.autocomplete = null;
        this.onLoad = this.onLoad.bind(this);
        this.onPlaceChanged = this.onPlaceChanged.bind(this);
        this.state = {
            center: {
                lat: 13.7563309,
                lng: 100.5017651
            },
            marker: {}
        }
    }

    componentDidMount() {
        if(this.props.initData && Object.entries(this.props.initData).length) {

            console.log('%c%s', 'color: #f279ca', "AAAAAAAAAAAAAAAAAAAAAAA");
            console.log('%c⧭', 'color: #00ff88', {
                center: {
                    lat: this.props.initData?.lat,
                    lng: this.props.initData?.lng
                },
                marker: {
                    lat: this.props.initData?.lat,
                    lng: this.props.initData?.lng
                }
            });
            this.setState({
                center: {
                    lat: this.props.initData?.lat,
                    lng: this.props.initData?.lng
                },
                marker: {
                    lat: this.props.initData?.lat,
                    lng: this.props.initData?.lng
                }
            })
        }
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.initData !== prevProps.initData) {
            if(this.props.initData && Object.entries(this.props.initData).length) {
                this.setState({
                    center: {
                        lat: this.props.initData.location.lat,
                        lng: this.props.initData.location.lng
                    },
                    marker: {
                        lat: this.props.initData.location.lat,
                        lng: this.props.initData.location.lng
                    }
                })
            }
        }
    }

    onLoad(autocomplete) {
        this.autocomplete = autocomplete;
    }

    onPlaceChanged() {
        if (this.autocomplete !== null) {
            var place = this.autocomplete.getPlace();
            var lat = place.geometry.location.lat();
            var lng = place.geometry.location.lng();
            this.setState({
                center: {
                    lat,
                    lng
                },
                marker: {
                    lat,
                    lng
                },
            })


            console.log('%c⧭', 'color: #735656', place);

            // let postalCode = place.address_components.map(ele => {
            //     if(ele.types.includes("postal_code")) {
            //         return ele.long_name
            //     }
            // })
            let postalCode = place.address_components.filter(ele => ele.types.includes("postal_code"))

            this.props.onPlaceChanged({
                type: 'search',
                location: { lat, lng },
                name: place.name,
                place_id: place.place_id,
                website: place.website,
                address: place.formatted_address,
                phone_number: place.formatted_phone_number,
                postalCode:  postalCode.length ? postalCode[0].long_name : ""
            })
        }
    }

    onMarkerDrag = (locate) => {
        if(locate) {
            let newLat = locate.latLng.lat()
            let newLng = locate.latLng.lng()
        
            this.setState({
                center: {
                    lat: newLat,
                    lng: newLng
                },
                marker: {
                    lat: newLat,
                    lng: newLng
                },
            })
            this.props.onPlaceChanged({
                type: 'mark',
                location: {
                    lat: newLat,
                    lng: newLng
                }
            })
        }
    }

    render() {
        return (
            <div style={{ height: '100%', width: '100%' }}>
            <LoadScript
                googleMapsApiKey="AIzaSyASRMSgirt2At_qCHJ6l2IrSSWZn1PxHv0"
                libraries={mapFeature}
                language={"th"}
                region={"th"}
                loadingElement={<Spin style={{alignSelf: "center"}}/>}
            >
                <GoogleMap
                    id="searchbox"
                    mapContainerStyle={mapContainerStyle}
                    zoom={(this.state.marker.lat && this.state.marker.lng) ? 18: 10}
                    center={{
                        lat: this.state.center.lat,
                        lng: this.state.center.lng,
                    }}
                >
                    {!this.props.onlyView && <Autocomplete
                        onLoad={this.onLoad}
                        onPlaceChanged={this.onPlaceChanged}
                    >
                        <input
                            type="text"
                            placeholder={this.props.searchBoxText || "Type for search the location"}
                            style={{
                                boxSizing: `border-box`,
                                border: `1px solid transparent`,
                                width: `240px`,
                                height: `32px`,
                                padding: `0 12px`,
                                borderRadius: `3px`,
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                fontSize: `14px`,
                                outline: `none`,
                                textOverflow: `ellipses`,
                                position: "absolute",
                                left: "50%",
                                marginLeft: "-120px",
                                marginTop: "10px"
                            }}
                        />
                    </Autocomplete>}
                    {
                        this.state.marker.lat && this.state.marker.lng &&
                        <Marker
                            position={this.state.marker}
                            draggable={this.props.onlyView ? false : true}
                            onDragEnd={this.onMarkerDrag}
                        />
                    }
                </GoogleMap>
            </LoadScript>
                </div>
        );
    }
}

export default MyMapWithAutocomplete;
