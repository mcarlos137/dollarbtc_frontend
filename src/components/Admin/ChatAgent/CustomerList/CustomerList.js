import React, { Component } from "react";
import {
	Tab,
	Label,
	Menu,
	Dimmer,
	Loader,
	Segment,
	Header,
	Icon,
	List,
	Input,
	Grid,
} from "semantic-ui-react";
import "./CustomerList.css";
import utils from "../../../../services/utils";
class CustomerList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: "",
			oldchat: [],
		};
	}

	getDate(timestamp) {
		let date = new Date(timestamp);
		if (utils.isToday(date)) {
			return date.getUTCHours() + ":" + date.getUTCMinutes();
		} else if (utils.isYesterday(date)) {
			return "Ayer";
		} else {
			return (
				date.getUTCDate() + " de " + utils.getMonthInLetters(date.getUTCMonth())
			);
		}
	}

	componentDidMount() {
		this.setState({
			chatAll: this.props.chatAll,
			oldchat: this.props.chatAll,
		});
	}

	render() {
		let {
			chatAll,
			searchLoad,
			onClickChatRoom,
			itemListClass,
			unRead,
		} = this.props;
		// notReadedMessages: true
		const notMessageToShow = (
			<Segment placeholder loading={searchLoad}>
				<Header icon>
					<Icon name='warning circle' />
					No hay chats para mostrar
				</Header>
			</Segment>
		);
		// const searchChats = (
		//   <Segment placeholder loading>
		//     <Header icon>
		//       <Icon name="warning circle" />
		//       No hay chats para mostrar
		//     </Header>
		//   </Segment>
		// );
		const getListChatRooms = (chats) => (
			<div>
				{searchLoad === true && (
					<Segment placeholder loading={searchLoad}>
						<Header icon>
							<Icon name='warning circle' />
							No hay chats para mostrar
						</Header>
					</Segment>
				)}
				{searchLoad === false && (
					<List verticalAlign='middle'>
						{chats.map((m) => (
							<List.Item
								as='a'
								key={m.name}
								onClick={() => onClickChatRoom(m.name, m.subject, m.language)}
								// className={m.notReadedMessages !== true ? itemListClass : "item-newmessage"}
								className={
									m.notReadedMessages !== true ? itemListClass : "item-normal"
								}>
								{/* {m.count>0 &&(
              <List.Content floated='right'>
                <Label size="mini" color="red" circular>{m.count}</Label>
              </List.Content>
            )} */}
								<List.Content>
									<List.Header>
										<Icon.Group>
											<Icon color='blue' name='user circle' />
											{/* <Icon corner name="circle" color="green" /> */}
										</Icon.Group>
										{m.name}
									</List.Header>
									<List bulleted horizontal link>
										{m.language !== null && m.language !== undefined && (
											<List.Item>
												<Label size='mini' color='grey'>
													{m.language}
												</Label>
											</List.Item>
										)}
										{m.subject !== null && m.subject !== undefined && (
											<List.Item>
												<Label size='mini' color='grey'>
													{m.subject}
												</Label>
											</List.Item>
										)}
										{/* {m.notReadedMessages === true && unRead !== false && ( */}
										{m.notReadedMessages === true && (
											<List.Item>
												<Label size='mini' color='red'>
													Mensajes no leidos
												</Label>
											</List.Item>
										)}
									</List>
								</List.Content>
							</List.Item>
						))}
					</List>
				)}
			</div>
		);
		const panes = [
			{
				menuItem: (
					<Menu style={{ marginRight: 80 }}>
						<Menu.Item key='all'>
							Todos{chatAll.length > 0 && <Label>{chatAll.length}</Label>}
						</Menu.Item>

						<Menu.Item>
							<Input
								type='text'
								placeholder='Filtrar'
								value={this.props.text}
								onChange={this.props.filter.bind(this)}></Input>
						</Menu.Item>
					</Menu>
				),

				pane: (
					<Tab.Pane key='tab-all' className='container-list'>
						{chatAll.length === 0 && notMessageToShow}
						{chatAll.length > 0 && getListChatRooms(chatAll)}
						{/* {searchLoad === true && searchChats} */}
					</Tab.Pane>

					// if (input !== "" or input !== undefined)
					// <Tab.Pane key="tab-all" className="container-list">
					// {chatAll.length === 0 && notMessageToShow}
					// {chatAll.length > 0 &&(
					//   getListChatRooms(chatAll)
					// )}
					// </Tab.Pane>
				),
			},
		];
		return (
			<Tab panes={panes} menu={{ pointing: true }} renderActiveOnly={false} />
		);
	}
}

export default CustomerList;
