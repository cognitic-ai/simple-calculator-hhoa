import { useState } from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";

export default function IndexRoute() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
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
    <View style={{ flex: 1, backgroundColor: bgColor, padding: 20 }}>
      <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}>
        <Text
          selectable
          style={{
            color: displayColor,
            fontSize: 80,
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
  );
}
