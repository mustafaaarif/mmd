import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  CardTitle,
  CardText,
  CardLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { Link } from "react-router-dom";

const Marketing = ({ editLink }) => {
  const [modal, setToggleModal] = useState(false);
  const toggle = () => setToggleModal(!modal);

  return (
    <>
      <Card>
        <CardBody>
          <CardTitle>Marketing Links and Pages</CardTitle>
          <CardText>
            To help you reach your fans and guide them to the shops they use, we
            are presenting Marketing Links and Pages.
          </CardText>
          <CardText>
            Marketing Links and Pages are helping to create intelligent links
            which are routing fans to the music they love, in the apps they use
            by creating beautiful landing pages and web players.
          </CardText>
          <ul className="marketingList">
            <li>
              Fill the simple form and send us your release link from one shop
            </li>
            <li>Your release will be detected across many relevant shops</li>
            <li>
              Branded short link and landing page is created and sent to your
              E-mail
            </li>
            <li>Digital download, stream and vinyl shop links included</li>
            <li>Unlimited use of your link and landing page</li>
            <li>
              Use your link and landing page on your website, social networks,
              e-mail campaigns, youtube etc.
            </li>
          </ul>

          <Button onClick={toggle} outline color="primary">
            Learn More
          </Button>

          <div className="linkContainer">
            <CardText>
              Move Music clients using Marketing Pages and Links:
            </CardText>
            <div className="linkContainerInner">
              <CardLink href="#">Example 1</CardLink>
              <CardLink href="#">Example 2</CardLink>
              <CardLink href="#">Example 3</CardLink>
              <CardLink href="#">Example 4</CardLink>
            </div>
          </div>

          <div className="linkContainer">
            <CardText>Subscribe</CardText>
            {/* <div className="linkContainerInner"> */}
            <p>
              <CardLink href="#">
                <b>Subscribe</b> (4.99€ per month)
              </CardLink>
            </p>
            <p>
              <CardLink href="#">
                <b>Subscribe</b> (50.31 € paid yearly) 30 % save
              </CardLink>
            </p>
          </div>
          {/* </div> */}
        </CardBody>
      </Card>

      <Modal isOpen={modal} toggle={toggle} centered={true}>
        <ModalHeader toggle={toggle}>How it works - FAQ</ModalHeader>
        <ModalBody>
          <b>Why Marketing Links and Pages ?</b>
          <p>
            The music industry has been drastically transformed in last two
            years. Even though digital music is rising, digital downloads and
            physical formats are dropping sales each year. Music consumption is
            fragmented and distributed across many different platforms and
            nowadays it is essentially important to promote all possible
            platforms (shops) to your fans. Clients using this type of landing
            pages and links have recorded on average up 56 % more sales in 12
            months.
          </p>
          <b>How it works ?</b>
          <p>
            Actually, it works very easy. All you need to do is to deliver us
            ONE active release link (Apple Music, Beatport, Deezer, iTunes,
            Spotify or any other shop) and we will automatically search for your
            release across many other shops and in the end create your LANDING
            PAGE and LINK for your marketing usage.
          </p>

          <b>What if my release is still in "Exclusive period" ?</b>
          <p>
            In this case only available "Exclusive" or "Pre-Ordered" shops will
            show up. All other shops will be active when release date becomes
            active on those.
          </p>

          <b>Which links will be on my landing page ?</b>
          <p>
            3rd party software will try to match your release with all major
            shops. With the assumption that your release is out and active in
            all shops worldwide, it should match and activate shortcuts and
            links for major shops such as Apple Music, Amazon Music, Beatport,
            Deezer, Google Music, iTunes, Napster, Tidal, Spotify etc. You can
            also deliver specific links during your order creation using
            "Additional Shop Links" field. Links such as Bandcamp, Junodownload,
            Traxsource, Whatpeopleplay and VINYL shops will be manually inserted
            on your landing page by our team.
          </p>

          <b>Where can I promote Marketing Links and Pages ?</b>
          <p>
            You should promote your unique Landing Page all over the internet
            including Social Networks, Youtube, Soundcloud etc. Marketing Links
            and Pages are meant to be a better solution than separate shop
            links.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Close
          </Button>
          {/*
  <Button color="success" onClick={() => handleSubmit()}>
    Confirm
  </Button> */}
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Marketing;
