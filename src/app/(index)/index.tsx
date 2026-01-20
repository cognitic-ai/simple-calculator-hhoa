import { useState } from "react";
import { View, Text, Pressable, useColorScheme, ScrollView } from "react-native";

export default function IndexRoute() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [scientificMode, setScientificMode] = useState(false);
  const scheme = useColorScheme();

  const handleNumber = (num: string) => {
    if (display === "Error") {
      setDisplay(num);
      setShouldResetDisplay(false);
      return;
    }
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (display === "Error") {
      setDisplay("0.");
      setShouldResetDisplay(false);
      return;
    }
    if (shouldResetDisplay) {
      setDisplay("0.");
      setShouldResetDisplay(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperation = (op: string) => {
    if (display === "Error") {
      return;
    }
    const currentValue = parseFloat(display);

    if (previousValue !== null && operation && !shouldResetDisplay) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      if (result === "Error") {
        setPreviousValue(null);
        setOperation(null);
        setShouldResetDisplay(true);
        return;
      }
      setPreviousValue(result as number);
    } else {
      setPreviousValue(currentValue);
    }

    setOperation(op);
    setShouldResetDisplay(true);
  };

  const calculate = (a: number, b: number, op: string): number | string => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : "Error";
      default: return b;
    }
  };

  const handleEquals = () => {
    if (display === "Error") {
      return;
    }
    if (previousValue !== null && operation) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleToggleSign = () => {
    if (display === "Error") return;
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const handlePercent = () => {
    if (display === "Error") return;
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handleScientific = (func: string) => {
    if (display === "Error") return;
    const value = parseFloat(display);
    let result: number;

    switch (func) {
      case "sin":
        result = Math.sin(value);
        break;
      case "cos":
        result = Math.cos(value);
        break;
      case "tan":
        result = Math.tan(value);
        break;
      case "ln":
        result = value > 0 ? Math.log(value) : NaN;
        break;
      case "log":
        result = value > 0 ? Math.log10(value) : NaN;
        break;
      case "√":
        result = value >= 0 ? Math.sqrt(value) : NaN;
        break;
      case "x²":
        result = value * value;
        break;
      case "x³":
        result = value * value * value;
        break;
      case "eˣ":
        result = Math.exp(value);
        break;
      case "1/x":
        result = value !== 0 ? 1 / value : NaN;
        break;
      case "π":
        result = Math.PI;
        break;
      case "e":
        result = Math.E;
        break;
      default:
        result = value;
    }

    if (isNaN(result)) {
      setDisplay("Error");
    } else {
      setDisplay(String(result));
    }
    setShouldResetDisplay(true);
  };

  const bgColor = scheme === "dark" ? "#000000" : "#000000";
  const displayColor = scheme === "dark" ? "#FFFFFF" : "#FFFFFF";

  const Button = ({
    label,
    onPress,
    color = "#333333",
    textColor = "#FFFFFF",
    flex = 1
  }: {
    label: string;
    onPress: () => void;
    color?: string;
    textColor?: string;
    flex?: number;
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex,
        aspectRatio: flex > 1 ? 2.2 : 1,
        backgroundColor: color,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        opacity: pressed ? 0.7 : 1,
        marginHorizontal: 6,
      })}
    >
      <Text style={{
        color: textColor,
        fontSize: 32,
        fontWeight: flex > 1 ? "400" : "400"
      }}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: bgColor }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}>
          <Pressable
            onPress={() => setScientificMode(!scientificMode)}
            style={({ pressed }) => ({
              alignSelf: "flex-start",
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: scientificMode ? "#FF9F0A" : "#333333",
              borderRadius: 20,
              marginBottom: 20,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>
              {scientificMode ? "Basic" : "Scientific"}
            </Text>
          </Pressable>

          <Text
            selectable
            style={{
              color: displayColor,
              fontSize: scientificMode ? 60 : 80,
              textAlign: "right",
              fontWeight: "300",
              fontVariant: ["tabular-nums"]
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {display}
          </Text>
        </View>

        {scientificMode && (
          <View style={{ gap: 12, marginBottom: 12 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Button label="sin" onPress={() => handleScientific("sin")} color="#1C1C1E" />
              <Button label="cos" onPress={() => handleScientific("cos")} color="#1C1C1E" />
              <Button label="tan" onPress={() => handleScientific("tan")} color="#1C1C1E" />
              <Button label="ln" onPress={() => handleScientific("ln")} color="#1C1C1E" />
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <Button label="log" onPress={() => handleScientific("log")} color="#1C1C1E" />
              <Button label="√" onPress={() => handleScientific("√")} color="#1C1C1E" />
              <Button label="x²" onPress={() => handleScientific("x²")} color="#1C1C1E" />
              <Button label="x³" onPress={() => handleScientific("x³")} color="#1C1C1E" />
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <Button label="eˣ" onPress={() => handleScientific("eˣ")} color="#1C1C1E" />
              <Button label="1/x" onPress={() => handleScientific("1/x")} color="#1C1C1E" />
              <Button label="π" onPress={() => handleScientific("π")} color="#1C1C1E" />
              <Button label="e" onPress={() => handleScientific("e")} color="#1C1C1E" />
            </View>
          </View>
        )}

        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button label="AC" onPress={handleClear} color="#A5A5A5" textColor="#000000" />
            <Button label="±" onPress={handleToggleSign} color="#A5A5A5" textColor="#000000" />
            <Button label="%" onPress={handlePercent} color="#A5A5A5" textColor="#000000" />
            <Button label="÷" onPress={() => handleOperation("÷")} color="#FF9F0A" />
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button label="7" onPress={() => handleNumber("7")} />
            <Button label="8" onPress={() => handleNumber("8")} />
            <Button label="9" onPress={() => handleNumber("9")} />
            <Button label="×" onPress={() => handleOperation("×")} color="#FF9F0A" />
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button label="4" onPress={() => handleNumber("4")} />
            <Button label="5" onPress={() => handleNumber("5")} />
            <Button label="6" onPress={() => handleNumber("6")} />
            <Button label="-" onPress={() => handleOperation("-")} color="#FF9F0A" />
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button label="1" onPress={() => handleNumber("1")} />
            <Button label="2" onPress={() => handleNumber("2")} />
            <Button label="3" onPress={() => handleNumber("3")} />
            <Button label="+" onPress={() => handleOperation("+")} color="#FF9F0A" />
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button label="0" onPress={() => handleNumber("0")} flex={2} />
            <Button label="." onPress={handleDecimal} />
            <Button label="=" onPress={handleEquals} color="#FF9F0A" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
