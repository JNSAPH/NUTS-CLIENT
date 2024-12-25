import * as Sentry from "@sentry/node";

const Logger = {
  info: <T extends unknown[]>(suffix: string, ...messages: T) =>
    logMessage("INFO - " + suffix, "color: #3b82f6;", ...messages),
  debug: <T extends unknown[]>(suffix: string, ...messages: T) =>
    logMessage("DEBUG - " + suffix, "color: #7c3aed;", ...messages),
  warning: <T extends unknown[]>(suffix: string, ...messages: T) =>
    logMessage("WARNING - " + suffix, "color: #d97706;", ...messages),
  error: <T extends unknown[]>(suffix: string, ...messages: T) =>
    logMessage("ERROR - " + suffix, "color: #ef4444;", ...messages),
  fatal: <T extends unknown[]>(suffix: string, ...messages: T) =>
    logMessage(
      "FATAL - " + suffix,
      "color: #ef4444; background: black",
      ...messages
    ),
} as const;

function logMessage<T extends unknown[]>(level: string, css: string, ...messages: T) {
  try {
    if (level.includes("DEBUG") && window.location.port !== "1420") return;

    const { stack } = new Error();
    const stackLines = stack?.split("\n") || [];
    let callerLine = stackLines[3]; // Adjust the index if necessary

    // Cleaning up the string to extract file name, line, etc.
    callerLine = callerLine.replace(/^\s*at\s*/, ""); // Removes the 'at ' from the start

    if (level === "FATAL" || level === "ERROR" || level === "WARNING") {
      console.error(`%c[${level}] ${callerLine}:\n`, css, ...messages);

      // Capture message in Sentry with the correct level
      //Sentry.captureMessage(messages.join(" "), level === "FATAL" ? "fatal" : level === "ERROR" ? "error" : "warning",)
    } else {
      console.log(`%c[${level}] ${callerLine}:\n`, css, ...messages);
    }
  } catch (error) {
    const errorMsg = `An error occurred while trying to use Logger: ${JSON.stringify(error)}`;
    console.error("Logger Error: ", errorMsg);
    console.log("Logged Message: ", ...messages);
  }
}

export default Logger;
