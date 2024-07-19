import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {useChatsQuery} from '../queries/useChatsQuery';
import {useChatMessagesQuery} from '../queries/useChatMessagesQuery';
import '../styles/ChatsPage.css';
import {
    TextField,
    Button,
    IconButton,
    AppBar,
    Toolbar,
    Typography,
    ListItem,
    List,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    CircularProgress, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ModeNightOutlinedIcon from '@mui/icons-material/ModeNightOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SlowMotionVideoOutlinedIcon from '@mui/icons-material/SlowMotionVideoOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import AnimationsIcon from '@mui/icons-material/Extension';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import BugReportIcon from '@mui/icons-material/BugReport';
import KVersionIcon from '@mui/icons-material/Upgrade';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';

const ChatsPage = () => {
    const {data, isLoading, error, fetchNextPage, hasNextPage} = useChatsQuery();
    const {chatId} = useParams();
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredChats, setFilteredChats] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [moreVertAnchorEl, setMoreVertAnchorEl] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isMobileMessageView, setIsMobileMessageView] = useState(false);
    const navigate = useNavigate();
    const observer = useRef();
    const [currentUser, setCurrentUser] = useState("");

    const lastChatElementRef = useCallback((node) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                setIsLoadingMore(true);
                fetchNextPage().finally(() => setIsLoadingMore(false));
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasNextPage, fetchNextPage]);

    useEffect(() => {
        if (data && data.pages.length > 0) {
            const chats = data.pages.flatMap((page) => page.data.data);
            setFilteredChats(chats);
            const defaultChat = chats.find((chat) => chat.id.toString() === chatId);
            setSelectedChat(defaultChat || null);
            if (defaultChat) {
                navigate(`/chat/${defaultChat.id}`);
                setCurrentUser(defaultChat.creator.id);
            }
        }
    }, [data, chatId, navigate]);

    useEffect(() => {
        if (data && data.pages.length > 0) {
            const chats = data.pages.flatMap((page) => page.data.data);
            const filtered = chats.filter((chat) => {
                const creatorName = chat.creator.name ? chat.creator.name.toLowerCase() : "unknown user";
                const query = searchQuery.toLowerCase().trim();
                return creatorName.includes(query) || (query === "unknown user" && !chat.creator.name);
            });
            setFilteredChats(filtered);
        }
    }, [searchQuery, data]);

    const handleChatClick = (chat) => {
        setSelectedChat(chat);
        navigate(`/chat/${chat.id}`);
        if (window.innerWidth <= 768) {
            setIsMobileMessageView(true);
        }
    };

    const handleBackClick = () => {
        setIsMobileMessageView(false);
        navigate('/');
    };

    const handleSendMessage = (message) => {
        console.log(message);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode', !darkMode);
        setAnchorEl(null);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMoreVertClick = (event) => {
        setMoreVertAnchorEl(event.currentTarget);
    };

    const handleMoreVertClose = () => {
        setMoreVertAnchorEl(null);
    };

    if (isLoading && !filteredChats.length) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="chats-page">
            <div className={`chat-list-section ${isMobileMessageView ? 'hidden' : ''}`}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        ><MenuItem component={Link} to="/" onClick={handleMenuClose}>
                            <BookmarkBorderOutlinedIcon/> Saved Messages
                        </MenuItem>
                            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                                <PersonOutlineOutlinedIcon/> Contacts
                            </MenuItem>
                            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                                <SlowMotionVideoOutlinedIcon/> My Stories
                            </MenuItem>
                            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                                <SettingsIcon/> Settings
                            </MenuItem>
                            <MenuItem onClick={toggleDarkMode}>
                                {darkMode ? <LightModeOutlinedIcon/> : <ModeNightOutlinedIcon/>}
                                {darkMode ? 'Light Mode' : 'Dark Mode'}
                            </MenuItem>
                            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                                <AnimationsIcon/> Animations
                            </MenuItem>
                            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                                <HelpOutlineOutlinedIcon/> Telegram Features
                            </MenuItem>
                            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                                <BugReportIcon/> Report a Bug
                            </MenuItem>
                            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                                <KVersionIcon/> Switch to K Version
                            </MenuItem>
                            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                                <AddCircleOutlineOutlinedIcon/> Install App
                            </MenuItem>
                        </Menu>
                        <TextField
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="chat-search-input"
                            InputProps={{
                                startAdornment: (
                                    <IconButton>
                                        <SearchIcon/>
                                    </IconButton>
                                ),
                            }}
                        />
                    </Toolbar>
                    <div className="links">
                        <Link className="link" to="/">All</Link>
                        <Link className="link" to="/">Best💖</Link>
                        <Link className="link" to="/">Top Channels</Link>
                    </div>
                </AppBar>
                <List className="chat-list">
                    {filteredChats.map((chat, index) => (
                        <ChatListItem
                            key={chat.id}
                            chat={chat}
                            handleChatClick={handleChatClick}
                            ref={filteredChats.length === index + 1 ? lastChatElementRef : null}
                            selectedChat={selectedChat}
                            lastChatElementRef={lastChatElementRef}
                        />
                    ))}
                    {isLoadingMore && (
                        <ListItem>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                                <CircularProgress size={24}/>
                            </div>
                        </ListItem>
                    )}
                </List>
            </div>
            <div className={`chat-window-section ${isMobileMessageView ? 'active' : ''}`}>
                <div className="chat-window">
                    {selectedChat ? (
                        <>
                            <AppBar position="static">
                                <div style={{display: "flex"}} className="chat-header">
                                    <div>
                                        {selectedChat && (
                                            <div className="username-top-left">
                                                {window.innerWidth <= 768 && (
                                                    <div style={{marginLeft: "2rem"}}>
                                                        <IconButton edge="start" color="inherit" aria-label="back"
                                                                    onClick={handleBackClick}>
                                                            <ArrowBackIcon/>
                                                        </IconButton>
                                                    </div>
                                                )}
                                                <div style={{marginLeft: "2rem"}}>
                                                    <Typography variant="h6">
                                                        <Avatar>{selectedChat.creator.name ? selectedChat.creator.name[0].toUpperCase() : '?'}</Avatar>
                                                        {selectedChat.creator.name ? selectedChat.creator.name : 'Unknown User'}
                                                    </Typography>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <Toolbar className={`header-right-icons ${!selectedChat ? 'hide-icons' : ''}`}>
                                        {selectedChat && (
                                            <>
                                                <IconButton>
                                                    <SearchIcon/>
                                                </IconButton>
                                                <IconButton onClick={handleMoreVertClick}>
                                                    <MoreVertIcon/>
                                                </IconButton>
                                            </>
                                        )}
                                        <Menu
                                            anchorEl={moreVertAnchorEl}
                                            keepMounted
                                            open={Boolean(moreVertAnchorEl)}
                                            onClose={handleMoreVertClose}
                                        >
                                            <MenuItem component={Link} to={`/chat/${chatId}`}
                                                      onClick={handleMoreVertClose}>
                                                <BoltOutlinedIcon/> Boost Group
                                            </MenuItem>
                                            <MenuItem component={Link} to={`/chat/${chatId}`}
                                                      onClick={handleMoreVertClose}>
                                                <NotificationsNoneOutlinedIcon/> Unmute
                                            </MenuItem>
                                            <MenuItem component={Link} to={`/chat/${chatId}`}
                                                      onClick={handleMoreVertClose}>
                                                <CampaignOutlinedIcon/> View Channel
                                            </MenuItem>
                                            <MenuItem component={Link} to={`/chat/${chatId}`}
                                                      onClick={handleMoreVertClose}>
                                                <CheckCircleOutlineOutlinedIcon/> Select messages
                                            </MenuItem>
                                            <MenuItem component={Link} to={`/chat/${chatId}`}
                                                      onClick={handleMoreVertClose}>
                                                <FlagOutlinedIcon/> Report
                                            </MenuItem>
                                            <MenuItem component={Link} to={`/chat/${chatId}`}
                                                      onClick={handleMoreVertClose}>
                                                <DeleteOutlinedIcon/> Leave Group
                                            </MenuItem>
                                        </Menu>
                                    </Toolbar>
                                </div>
                            </AppBar>
                            <ChatWindow chatId={selectedChat.id} handleSendMessage={handleSendMessage}
                                        currentUser={currentUser}/>
                        </>
                    ) : (
                        <div className="empty-chat"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChatListItem = React.forwardRef(({chat, handleChatClick, selectedChat, lastChatElementRef}, ref) => {
    const {data: messagesData, isLoading} = useChatMessagesQuery(chat.id);
    const lastMessage = messagesData?.data?.length ? messagesData.data[messagesData.data.length - 1].message : 'No messages yet';
    const lastTime = messagesData?.data?.length ? formatTimestamp(messagesData.data[messagesData.data.length - 1].created_at) : "";

    function truncateMessage(message) {
        const maxLength = 30;
        if (message.length > maxLength) {
            return message.substring(0, maxLength) + '...';
        }
        return message;
    }

    return (
        <ListItem
            onClick={() => handleChatClick(chat)}
            ref={ref}
            className={selectedChat && selectedChat.id === chat.id ? 'selected-chat' : ''}
        >
            <Link to={`/chat/${chat.id}`} className="chat-link">
                <Avatar>{chat.creator.name ? chat.creator.name[0].toUpperCase() : '?'}</Avatar>
                <ListItemText
                    primary={<div className="primary-text-wrapper">
                        <span className="primary-text">{chat.creator.name || "Unknown User"}</span>
                        <span className="last-time">{lastTime}</span></div>}
                    secondary={isLoading ? <CircularProgress size={20}/> :
                        <span className="secondary-text">{truncateMessage(lastMessage)}</span>}
                />
            </Link>
        </ListItem>
    );
});

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const period = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
};

const ChatWindow = ({chatId, handleSendMessage, currentUser}) => {
    const {data, isLoading, error} = useChatMessagesQuery(chatId);
    const [messageInput, setMessageInput] = useState('');

    const sendMessage = () => {
        if (messageInput.trim() === '') return;
        handleSendMessage(messageInput);
        setMessageInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    if (isLoading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <CircularProgress/>
            </div>
        );
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="chat-window">
            <div className="messages-container">
                <List className="message-list">
                    {data.data.map((message) => (
                        <ListItem key={message.id}
                                  className={message.sender.id === currentUser ? "incoming" : "outgoing"}>
                            <ListItemText
                                primary={message?.sender?.name ? (message.sender.name === "BeyondChat" ? "You" : message.sender.name) : "Unknown User"}
                                secondary={
                                    <div className="secondary-text-wrapper">
                                        <div className="message">{message.message}</div>
                                        <Typography
                                            className="timestamp">{formatTimestamp(message.created_at)}</Typography>
                                    </div>
                                }
                                secondaryTypographyProps={{component: 'span', color: 'textPrimary'}}
                            />
                        </ListItem>
                    ))}
                </List>
            </div>
            {window.location.pathname !== '/' && (
                <div className="message-input">
                    <TextField
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyUp={handleKeyPress}
                        placeholder="Message"
                        className="message-input-field"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SentimentSatisfiedOutlinedIcon className="start-adornment"/>
                                </InputAdornment>
                            ),
                            endAdornment: messageInput.trim() === '' ? (
                                <IconButton>
                                    <MicIcon/>
                                </IconButton>
                            ) : (
                                <Button onClick={sendMessage} className="send-message-button">
                                    <SendOutlinedIcon/>
                                </Button>
                            ),
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ChatsPage;