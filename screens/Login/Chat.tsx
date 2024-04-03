import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Center, Heading } from '@gluestack-ui/config/build/theme';
import GuestLayout from '../../layouts/GuestLayout';
import { Button, ButtonIcon, Input, InputField, InputIcon } from '@gluestack-ui/themed';
import { BoxIcon, FileUp, Send, User, Bot } from 'lucide-react-native';
import { Box } from '@gluestack-ui/themed';
import { styled } from '@gluestack-style/react';
import { Image } from '@gluestack-ui/themed';
import { Icon } from '@gluestack-ui/themed';
import axiosInstance from '../../axios';
import * as DocumentPicker from 'expo-document-picker';
import chat from '../../app/chat';
import axios from 'axios';

const StyledImage = styled(Image, {
  props: {
    style: {
      height: 40,
      width: 320,
    },
  },
});

const Logo = () => {
  return (
    <>
      <StyledImage
        resizeMode="contain"
        source={require('./assets/images/Logo.png')}
        style={{ width: 500, height: 500 }}
      />
    </>
  )
};

const TopBar = () => {
  return (
    <Box
      bg="$primary500"
      p='$5'
    >
      <Text style={{ color: 'white' }}>
        KanoonGPT
      </Text>
    </Box>
  )
};

const BotChat = () => {
  return (
    <Box
      bg="$blue600"
      p="$5"
    >
      <Icon mr='$100' as={Bot} />
      <Text style={{ color: 'white' }}>
        This is the Box
      </Text>
    </Box>
  )
};

const UserChat = () => {
  return (
    <Box
      bg="$green600"
      p="$5"
    >
      <Icon mr='$100' as={User} />
      <Text style={{ color: 'white' }}>
        This is the Box
      </Text>
    </Box>
  )
};

const SendButton = ({ onPress }) => {
  return (
    <Button
      borderRadius="$full"
      size="lg"
      p="$3.5"
      bg="$green600"
      borderColor="$red600"
      onPress={onPress} // Call the onPress function passed from the parent component
    >
      <ButtonIcon as={Send} />
    </Button>
  );
};


const UploadButton = ({ setChat }) => {

  const openPicker = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (file.type === 'success') {
        const response = await fetch(file.uri);
        const blob = await response.blob();

        const reader = new FileReader();

        reader.onload = () => {
          const textPDF = reader.result;
          setChat(prevState => ({ ...prevState, pdf: textPDF })); // Update chat state with the PDF URI
        };

        reader.onerror = (error) => {
          console.error('Error reading PDF:', error);
          Alert.alert('Error', 'Failed to read PDF.');
        };

        reader.readAsText(blob);
      } else {
        Alert.alert('Document picked', JSON.stringify(file, null, 2));
        console.log(JSON.stringify(file, null, 2));
       ;
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  return (
    <Button
      borderRadius="$full"
      size="$sm"
      p="$1"
      m='$1'
      bg="$indigo600"
      borderColor="$indigo600"
      h='$6'
      onPress={openPicker}
    >
      <ButtonIcon as={FileUp} />
    </Button>
  );
};

const ChatBox = ({ handleSubmit }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [chat, setChat] = useState({
    userId: 1,
    message: "",
    pdf: null,
  });

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleSendMessage = () => {
    handleSubmit(chat);
    setChat({ ...chat, message: "" }); // Clear message after sending
  };
  console.log("this is Chat data",chat)

  return (
    <View style={styles.inputContainer}>
      <Input
        variant="outline"
        size="$lg"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
        bg="white"
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={chat.message}
        onChangeText={(text:string) => setChat({ ...chat, message: text })}
        style={[styles.chatBox, isFocused && styles.focused]}
      >
        <InputField placeholder="Enter  here" />
        <InputIcon as={UploadButton} setChat={setChat} />
      </Input>
      <SendButton onPress={handleSendMessage} />
    </View>
  );
};

const Chat = () => {
  const handleSubmit = (chat) => {

  
    axios.post(`http://127.0.0.1:8000/api/chat/`, {
      id:23,
      user: chat.userId,
      message: chat.message,
      pdf_file: chat.pdf,
      bot_response: null
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  

  return (
    <GuestLayout>
      <View style={styles.container}>
        <TopBar />
        <UserChat />
        <BotChat />
        <View style={styles.chatContainer}>
          <ChatBox handleSubmit={handleSubmit} />
        </View>
      </View>
    </GuestLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  helloText: {
    // Ensure consistent styling with other elements
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20, // Adjust margin for desired spacing (optional)
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  chatBox: {
    flex: 1,
    borderRadius: 10,
    marginRight: 10,
  },
  focused: {
    borderWidth: 2, // Increase border width on focus
    borderColor: '#007bff', // Set desired glow color
    shadowColor: '#007bff', // Shadow color for glow effect
    shadowOffset: { width: 0, height: 2 }, // Adjust shadow offset
    shadowOpacity: 0.3, // Adjust shadow opacity
    shadowRadius: 4, // Adjust shadow blur radius
  },
});

export default Chat;
