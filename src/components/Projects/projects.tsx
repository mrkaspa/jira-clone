import React, { useState } from "react";
import {
  Modal,
  Button,
  Container,
  Header,
  Loader,
  Icon,
  Menu,
  Table,
} from "semantic-ui-react";
import ProjectModal from "./project-modal";
import { useAllProjectsDetailsQuery } from "./types/operations";
import { UserWithIcon } from "../User/user";
import { Link } from "react-router-dom";
import { ConditionalWrapper } from "../../utils";

export interface ProjectProps {
  withProjectEdits: boolean;
}

function Projects(props: ProjectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <Container text>
      {props.withProjectEdits && (
        <Modal
          open={modalVisible}
          closeOnDimmerClick={true}
          onClose={closeModal}
        >
          <ProjectModal closeModal={closeModal} />
        </Modal>
      )}

      <Menu pointing secondary>
        <Menu.Item header>Projects</Menu.Item>
        <Menu.Menu position="right">
          {props.withProjectEdits && (
            <Menu.Item onClick={openModal}>
              <Icon name="plus" />
              New Project
            </Menu.Item>
          )}
        </Menu.Menu>
      </Menu>

      {ProjectList(props.withProjectEdits)}
    </Container>
  );
}

function ProjectList(withProjectEdits: boolean) {
  const { loading, error, data } = useAllProjectsDetailsQuery();

  if (loading) return <Loader />;
  if (error) return `Error! ${error.message}`;

  const items = data?.queryProject?.map((proj: any) => {
    let icon:
      | "github"
      | "gitlab"
      | "bitbucket"
      | "trello"
      | "facebook"
      | "microsoft"
      | "google"
      | "react"
      | "amazon"
      | "aws"
      | "app store ios"
      | "columns" = "columns";
    if (proj?.url?.includes("github")) {
      icon = "github";
    } else if (proj?.url?.includes("gitlab")) {
      icon = "gitlab";
    } else if (proj?.url?.includes("bitbucket")) {
      icon = "bitbucket";
    } else if (proj?.url?.includes("trello")) {
      icon = "trello";
    } else if (proj?.url?.includes("facebook")) {
      icon = "facebook";
    } else if (proj?.url?.includes("microsoft")) {
      icon = "microsoft";
    } else if (proj?.url?.includes("google")) {
      icon = "google";
    } else if (proj?.url?.includes("react")) {
      icon = "react";
    } else if (proj?.url?.includes("amazon")) {
      icon = "amazon";
    } else if (proj?.url?.includes("aws")) {
      icon = "aws";
    } else if (proj?.url?.includes("apple")) {
      icon = "app store ios";
    }
    return (
      <Table.Row key={proj?.projID}>
        <Table.Cell>
          <ConditionalWrapper
            condition={Boolean(proj?.url)}
            wrapper={(children) => (
              <a href={proj?.url ?? ""} target="__blank">
                {children}
              </a>
            )}
          >
            <Icon name={icon} size="large" color="black" />
          </ConditionalWrapper>
        </Table.Cell>
        <Table.Cell>
          <Header as="h4">
            <Header.Content
              as={Link}
              to={"/project/" + proj?.projID}
              className="black"
            >
              {proj?.name}
              <Header.Subheader>{proj?.description}</Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{proj?.admin && UserWithIcon(proj?.admin)}</Table.Cell>
        <Table.Cell>
          {withProjectEdits && (
            <Modal
              trigger={
                <Button animated="vertical">
                  <Button.Content visible>
                    <Icon name="edit" />
                  </Button.Content>
                  <Button.Content hidden>Edit</Button.Content>
                </Button>
              }
            >
              <ProjectModal projID={proj?.projID} />
            </Modal>
          )}
        </Table.Cell>
      </Table.Row>
    );
  });

  return (
    <Table basic="very">
      <Table.Body>{items}</Table.Body>
    </Table>
  );
}

export default Projects;
