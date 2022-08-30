import { StatusBar } from "expo-status-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { theme } from "./colors";
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const FONTSIZE = 10;
const STORAGEKEY = "@somthine";
function App() {
  const [work, setWork] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGEKEY);
      if (value !== null) {
        setToDos(JSON.parse(value));
      }
    } catch (e) {
      console.log(e);
    }
  }
  const saveData = async (newToDos) => {
    try {
      await AsyncStorage.setItem(STORAGEKEY, JSON.stringify(newToDos))
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => { getData() }, []);
  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <StatusBar style="light" />
      <View style={styles.app}>
        <TouchableOpacity onPress={() => setWork(true)}>
          <Text style={{ ...styles.title, color: work ? "white" : theme.grey }}>
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setWork(false)}>
          <Text style={{ ...styles.title, color: work ? theme.grey : "white" }}>
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={(input) => setText(input)}
        value={text}
        placeholder={work ? "write your work" : "where to go"}
        returnKeyType="done"
        onSubmitEditing={async () => {
          if (text === "") {
            return
          }
          setText("");
          const newToDos = {
            ...toDos, [Date.now()]: {
              isWork: work,
              isDone: false,
              innerText: text,
            }
          };
          setToDos(newToDos);
          saveData(newToDos);
        }
        } />
      <ScrollView style={styles.main}>
        {toDos.length !== 0 ? Object.keys(toDos).map((key) => {
          if (work === toDos[key].isWork) {
            return (
              <View key={key} style={styles.toDo}>
                <TouchableOpacity onPress={async () => {
                  const newToDos = { ...toDos };
                  newToDos[key].isDone = !newToDos[key].isDone;
                  console.log(newToDos);
                  setToDos(newToDos);
                  saveData(newToDos);
                }}>
                  {toDos[key].isDone
                    ? <MaterialCommunityIcons name="checkbox-marked-outline" size={FONTSIZE * 1.8} color="grey" />
                    : <MaterialCommunityIcons name="checkbox-blank-outline" size={FONTSIZE * 1.8} color="white" />
                  }
                </TouchableOpacity>
                <Text style={toDos[key].isDone ? styles.text2 : styles.text} numberOfLines={3}>{toDos[key].innerText}</Text>
                <TouchableOpacity onPress={() => {
                  Alert.alert("Do you want to Delete?", "delete items", [{ text: "Cancel", style: "cancel" },
                  {
                    text: "Delete", style: "destructive", onPress: async () => {
                      const newToDos = { ...toDos };
                      delete newToDos[key];
                      setToDos(newToDos);
                      saveData(newToDos);
                    }
                  }])
                }}>
                  <MaterialIcons name="delete-forever" size={FONTSIZE * 1.8} color="red" />
                </TouchableOpacity>
              </View>
            )

          }
        }
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    width: "100%",
    flexDirection: "row",
    marginVertical: FONTSIZE * 4,
    justifyContent: "space-between",
    paddingHorizontal: FONTSIZE * 2
  },
  title: {
    fontWeight: "bold",
    fontSize: FONTSIZE * 3,
    textAlign: "center",
    color: "white"
  },
  input: {
    marginHorizontal: FONTSIZE * 1,
    fontWeight: "600",
    fontSize: FONTSIZE * 2,
    textAlign: "center",
    backgroundColor: "white",
    color: "black",
    height: FONTSIZE * 3.5,
    borderRadius: FONTSIZE * 1.75,
    marginBottom: FONTSIZE,
  },
  toDo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: FONTSIZE,
    backgroundColor: theme.grey,
    marginHorizontal: FONTSIZE * 1,
    marginTop: FONTSIZE * 1,
    paddingVertical: FONTSIZE,
    paddingHorizontal: FONTSIZE,

  },
  text: {
    width: "80%",
    fontSize: FONTSIZE * 1.8,
    color: "white",
    fontWeight: "500",
  },
  text2: {
    width: "80%",
    fontSize: FONTSIZE * 1.8,
    textDecorationLine: "line-through",
    color: "grey",
    fontWeight: "500",
  },
  main: {
    color: "#1B95E0"
  }
});

export default App;
