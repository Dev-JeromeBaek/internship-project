import React, { Component, Fragment } from 'react';
import {
  Button,
  Alert,
  FormGroup,
  Input,
  ButtonGroup,
  Card,
  CardBody,
} from 'reactstrap';
import { apiContext } from '../../store/ApiStore';
import { NavLink } from 'react-router-dom';
import GlobalConfirmModal from '../global/GlobalConfirmModal';

class ApiDetail extends Component {
  state = {
    isUpdate: false,
    updatedApi: {},
  };

  goApi = () => {
    this.props.history.push('/admin-api');
  };

  makeRemovedAdditionalDescription = apiDetail => {
    const {
      additionalDescription,
      apiName,
      ...removedAdditionalDescription
    } = apiDetail;
    return removedAdditionalDescription;
  };

  checkKeyName = key => {
    switch (key) {
      case 'apiId': {
        key = 'API ID';
        break;
      }
      case 'apiName': {
        key = 'API 이름';
        break;
      }
      case 'requestUrl': {
        key = '요청 URL';
        break;
      }
      case 'httpMethod': {
        key = 'HTTP Method';
        break;
      }
      case 'returnType': {
        key = '리턴 타입';
        break;
      }
      case 'defaultDescription': {
        key = '설명';
        break;
      }
      default: {
        key = '추가 설명';
        break;
      }
    }

    return key;
  };

  updateApi = () => {
    this.setState({
      isUpdate: !this.state.isUpdate,
    });
  };

  handleChange = e => {
    this.setState({
      updatedApi: {
        ...this.props.apiDetail,
        additionalDescription: e.target.value,
      },
    });
  };

  addApi = () => {
    const apiDetail = { ...this.props.apiDetail, isUsedApi: 'F' };
    this.props.value.actions.saveAvailableApi(apiDetail);
  };

  render() {
    let { apiDetail } = this.props;

    if (!this.props.isMyApiDetail) {
      apiDetail = this.makeRemovedAdditionalDescription(apiDetail);
    }

    return (
      <Card className="shadow">
        <CardBody>
          <div>
            {this.props.isMyApiDetail && (
              <Fragment>
                <div className="d-flex align-items-center">
                  <div>
                    {!this.props.isResponsive && (
                      <NavLink
                        to="/admin-api"
                        className="btn btn-secondary btn-sm mr-2"
                      >
                        목록
                      </NavLink>
                    )}
                  </div>
                  <div className="ml-auto">
                    {this.state.isUpdate ? (
                      <div>
                        <ButtonGroup size="sm">
                          <Button color="danger" onClick={this.updateApi}>
                            취소
                          </Button>
                          <Button
                            color="primary"
                            onClick={() => {
                              this.props.value.actions.updateAdditionalDescription(
                                this.state.updatedApi,
                              );
                              this.updateApi();
                            }}
                          >
                            확인
                          </Button>
                        </ButtonGroup>
                      </div>
                    ) : (
                      <div className="d-flex">
                        <ButtonGroup>
                          <Button
                            size="sm"
                            color="primary"
                            onClick={this.updateApi}
                          >
                            수정
                          </Button>
                          <GlobalConfirmModal
                            isNavLink={true}
                            deleteMyApi={() => {
                              this.props.value.actions.deleteMyApi(apiDetail);
                            }}
                            goApi={this.goApi}
                            info={apiDetail}
                            addApi={this.addApi}
                          />
                        </ButtonGroup>
                      </div>
                    )}
                  </div>
                </div>
                <hr />
              </Fragment>
            )}
          </div>
          {Object.keys(apiDetail).map(key => {
            if (key === 'isUsedApi' || key === 'apiId') {
              return false;
            }

            return (
              <div key={key}>
                {key === 'additionalDescription' && (
                  <Alert color="info" isOpen={this.state.isUpdate}>
                    추가 설명만 변경할 수 있습니다.
                  </Alert>
                )}
                <FormGroup className="mb-3">
                  <label className="font-weight-bold">
                    {this.checkKeyName(key)}
                  </label>
                  {key === 'additionalDescription' ? (
                    <textarea
                      className="form-control bg-white"
                      rows="3"
                      defaultValue={apiDetail[key]}
                      disabled={this.state.isUpdate ? false : true}
                      onChange={this.handleChange}
                      maxLength="255"
                    />
                  ) : (
                    <Input
                      type="text"
                      className="bg-white"
                      defaultValue={apiDetail[key]}
                      disabled
                    />
                  )}
                </FormGroup>
              </div>
            );
          })}
        </CardBody>
      </Card>
    );
  }
}

export default apiContext(ApiDetail);
