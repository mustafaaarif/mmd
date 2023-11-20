import React from "react";

import {
  Card,
  Row,
  CardBody,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Badge,
  UncontrolledTooltip
} from "reactstrap";

const Example = props => {
  return (
    <Row>
      <Col sm={12}>
        <Card>
          <CardBody>
            <h3>Featuring proposal</h3>
            <Row>
              <Col sm={12}>
                <p>
                  Welcome to Move Music Distribution "release featuring form".
                  In order to present your release to major online shops our
                  marketing team needs all relevant release informations. It is
                  essentially important to fill in this form as accurate as you
                  can.
                </p>
                <p>
                  NOTE :
                  <b>
                    &nbsp;This form has to be submitted at least 21 days before
                    first release date.
                  </b>
                  <br />
                  Unfortunately late submissions can´t be taken into
                  consideration.
                </p>
                <a
                  href="https://support.movemusicdistribution.com/portal/kb/articles/how-to-get-banner-or-featured-release"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* <b>Featuring request FAQ</b> */}
                </a>
              </Col>
            </Row>

            <h3>General info</h3>
            <Form>
              <FormGroup row>
                <Label for="email" sm={2}>
                  Email
                </Label>
                <Col sm={4}>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="mail@yourdomain.com"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="catNum" sm={2}>
                  Catalogue number
                </Label>
                <Col sm={4}>
                  <Input
                    type="text"
                    name="catNum"
                    id="catNum"
                    placeholder="UFD002"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="upc" sm={2}>
                  UPC/EAN
                </Label>
                <Col sm={4}>
                  <Input
                    type="number"
                    name="upc"
                    id="upc"
                    placeholder="4212345678901"
                  />
                  <span>
                    <Badge id="btnUpc" color="primary">
                      Learn more
                    </Badge>
                    <UncontrolledTooltip placement="right" target="btnUpc">
                      Tooltip Content!
                    </UncontrolledTooltip>
                  </span>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="labelName" sm={2}>
                  Label name
                </Label>
                <Col sm={4}>
                  <Input
                    type="text"
                    name="labelName"
                    id="labelName"
                    placeholder="Label Name"
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="releaseName" sm={2}>
                  Release name
                </Label>
                <Col sm={4}>
                  <Input type="text" name="releaseName" id="releaseName" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="releaseArtists" sm={2}>
                  Main release artist-s
                </Label>
                <Col sm={4}>
                  <Input
                    type="text"
                    name="releaseArtists"
                    id="releaseArtists"
                  />
                  <FormText color="muted">
                    Insert all main release artist-s. Separated more artists
                    with comma.
                  </FormText>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="releaseRemixer" sm={2}>
                  Release remixer-s
                </Label>
                <Col sm={4}>
                  <Input
                    type="text"
                    name="releaseRemixer"
                    id="releaseRemixer"
                  />
                  <FormText color="muted">
                    Insert release remixer-s. Separate multiple remixers with
                    comma.
                  </FormText>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="releaseFormat" sm={2}>
                  Release format
                </Label>
                <Col sm={4}>
                  <Input
                    type="textarea"
                    name="releaseFormat"
                    id="releaseFormat"
                    placeholder="Single / EP / Album / Compilation"
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="releaseGenre" sm={2}>
                  Release genre
                </Label>
                <Col sm={4}>
                  <Input
                    type="textarea"
                    name="releaseGenre"
                    id="releaseGenre"
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="releaseDate" sm={2}>
                  General release date
                </Label>
                <Col sm={4}>
                  <Input type="text" name="releaseDate" id="releaseDate" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="releaseDateEx" sm={2}>
                  Exclusive shop release date
                </Label>
                <Col sm={4}>
                  <Input type="text" name="releaseDateEx" id="releaseDateEx" />
                  <FormText color="muted">
                    If there is an exclusive release date, please insert it.
                    <br />
                    <b>
                      If you do not use it, please match same date as for
                      General release date.
                    </b>
                  </FormText>
                </Col>
              </FormGroup>

              <hr />

              <h3>Social</h3>

              <FormGroup row>
                <Label for="statsFb" sm={2}>
                  Facebook stats
                </Label>
                <Col sm={4}>
                  <Input type="number" name="statsFb" id="statsFb" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="statsSc" sm={2}>
                  Soundcloud stats
                </Label>
                <Col sm={4}>
                  <Input type="number" name="statsSc" id="statsSc" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="statsIg" sm={2}>
                  Instagram stats
                </Label>
                <Col sm={4}>
                  <Input type="number" name="statsIg" id="statsIg" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="statsTwt" sm={2}>
                  Twitter stats
                </Label>
                <Col sm={4}>
                  <Input type="number" name="statsTwt" id="statsTwt" />
                </Col>
              </FormGroup>

              <span>
                <Badge id="btnSocial" color="primary">
                  Social networks instruction
                </Badge>
                <UncontrolledTooltip placement="right" target="btnSocial">
                  Tooltip Content!
                </UncontrolledTooltip>
              </span>

              <hr />
              <h3>Marketing</h3>

              <FormGroup row>
                <Label for="onlineMark" sm={2}>
                  Online marketing
                </Label>
                <Col sm={4}>
                  <Input type="text" name="onlineMark" id="onlineMark" />
                  <span>
                    <Badge id="btnMark" color="primary">
                      Info
                    </Badge>
                    <UncontrolledTooltip placement="right" target="btnMark">
                      Tooltip Content!
                    </UncontrolledTooltip>
                  </span>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="trackPitch" sm={2}>
                  Specific track for pitching
                </Label>
                <Col sm={4}>
                  <Input type="text" name="trackPitch" id="trackPitch" />
                  <FormText color="muted">
                    Specific track that you’d like to select for playlist
                    pitching.
                  </FormText>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="listLink" sm={2}>
                  Listening link
                </Label>
                <Col sm={4}>
                  <Input
                    type="text"
                    name="listLink"
                    id="listLink"
                    placeholder="https://www.soundcloud.com/..."
                  />
                  <FormText color="muted">
                    Private soundcloud set or equivalent
                  </FormText>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="feedbacks" sm={2}>
                  Feedbacks
                </Label>
                <Col sm={4}>
                  <Input
                    type="textarea"
                    name="feedbacks"
                    id="feedbacks"
                    placeholder="Dj Name - feedback"
                  />
                  <FormText color="muted">
                    Insert 10 DJ / Radio / Magazine feedbacks in format " Name -
                    Feedback" (Insert each feedback in one line).
                    <br />
                    <b>
                      Submissions containing "downloading for" won´t be promoted
                      or sent to online shops.
                    </b>
                  </FormText>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="editorial" sm={2}>
                  Editorial support
                </Label>
                <Col sm={4}>
                  <Input
                    type="textarea"
                    name="editorial"
                    id="editorial"
                    placeholder="Dj Name - feedback"
                  />
                  <FormText color="muted">
                    (Interviews, blogs, reviews, magazine articles) - Please
                    list all committed press & marketing activities for this
                    release.
                    <br />
                    <b>
                      Not mandatory but essentially important to stand out of
                      competition.
                    </b>
                  </FormText>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="bio" sm={2}>
                  Main artist bio
                </Label>
                <Col sm={4}>
                  <Input type="textarea" name="bio" id="bio" />
                  <span>
                    <Badge id="btnBio" color="primary">
                      Info
                    </Badge>
                    <UncontrolledTooltip placement="right" target="btnBio">
                      Tooltip Content!
                    </UncontrolledTooltip>
                  </span>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="pressReport" sm={2}>
                  Press report
                </Label>
                <Col sm={4}>
                  <Input type="text" name="pressReport" id="pressReport" />
                  <span>
                    <Badge id="btnPress" color="primary">
                      Info
                    </Badge>
                    <UncontrolledTooltip placement="right" target="btnPress">
                      Tooltip Content!
                    </UncontrolledTooltip>
                    <FormText color="muted">
                      <b>
                        Not mandatory but essentially important to stand out of
                        competition.
                      </b>
                    </FormText>
                  </span>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Col>

      <Col sm={4}>
        <Card>
          <CardBody>
            <h3>Support</h3>
            <p>
              To learn more visit our
              <a
                href="https:support.movemusicdistribution.com/portal/kb"
                target="_blank"
                rel="noopener noreferrer"
              >
                <b> Help Center / FAQ </b>
              </a>
              or click on "Help" icon in the right corner of your screen
            </p>
            <p>
              If you can not find answers to your questions in our Help Center,
              please contact us:
            </p>
            <p>
              Monday - Thursday
              <br />
              10:00 - 18:00
            </p>
            <p>
              <i className="fa fa-phone"></i> +49 (0) 61909356175
              <br />
              <i className="fa fa-envelope"></i> Support &amp; Questions{" "}
              <a href="mailto:support@movemusicdistribution.com">E-mail</a> or{" "}
              <a
                href="https:support.movemusicdistribution.com/portal/newticket"
                target="_blank"
                rel="noopener noreferrer"
              >
                <b>SUBMIT A REQUEST</b>
              </a>
              <br />
            </p>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Example;
