"use client";

import Link from "next/link";
import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import styles from "./CoWorkerPage.module.css";

type BookingMode = "now" | "later";

const SHARE_ITEMS = [
  "A zipped folder, or a repository link with read access for your assigned engineer",
  'A short brief: what is broken, what you want done, and what "done" means',
  "Error messages, logs, screenshots, and instructions to run the project",
  "Deadlines and the best person to contact if the engineer gets stuck",
];

const KEEP_PRIVATE_ITEMS = [
  "Passwords, API keys, private keys, or .env files",
  "Production database access or customer personal data",
  "Anything you are not allowed to share outside your company",
];

const STARTERS = [
  { label: "Fix bugs", text: "Fix the bugs I've listed." },
  { label: "Review backlog", text: "Clear my review and PR backlog." },
  { label: "Write tests", text: "Write tests for the untested modules." },
  { label: "Finish a feature", text: "Finish the half-built feature and document it." },
  { label: "Docs", text: "Write the docs and README nobody has time for." },
];

const BLOCKED_FILE = /(^|\/)\.env(?:\..*)?$|(^|\/)(?:id_rsa|.*\.(?:pem|key))$/i;
const EXCLUDED_FOLDER = /(^|\/)(?:node_modules|venv|\.git)(\/|$)/i;
const MAX_FILE_BYTES = 100 * 1024 * 1024;
const TOTAL_PRICE = 3480;
const ADVANCE_PRICE = 870;
const REMAINING_PRICE = TOTAL_PRICE - ADVANCE_PRICE;

function toInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, count: number) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + count);
  return next;
}

function getNextWeekday(weekday: number) {
  const date = addDays(new Date(), 1);
  while (date.getDay() !== weekday) date.setDate(date.getDate() + 1);
  return date;
}

function getFilePath(file: File) {
  return (
    (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
    file.name
  );
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatBookingDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function CoWorkerIntake() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<BookingMode>("now");
  const [date, setDate] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [repo, setRepo] = useState("");
  const [brief, setBrief] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [bookingReady, setBookingReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const today = new Date();
  const minDate = toInputDate(addDays(today, 1));
  const maxDate = toInputDate(addDays(today, 90));

  const addFiles = (selectedFiles: FileList | File[]) => {
    setFileError("");
    const skippedSensitive: string[] = [];
    let skippedLarge = false;
    const acceptedFiles = [...files];
    let totalBytes = acceptedFiles.reduce((sum, file) => sum + file.size, 0);

    Array.from(selectedFiles).forEach((file) => {
      const path = getFilePath(file);
      if (EXCLUDED_FOLDER.test(path)) return;
      if (BLOCKED_FILE.test(path)) {
        skippedSensitive.push(file.name);
        return;
      }
      if (totalBytes + file.size > MAX_FILE_BYTES) {
        skippedLarge = true;
        return;
      }
      acceptedFiles.push(file);
      totalBytes += file.size;
    });

    setFiles(acceptedFiles);
    const messages = [];
    if (skippedSensitive.length) {
      messages.push(
        `Skipped files that may contain secrets: ${skippedSensitive.join(", ")}.`,
      );
    }
    if (skippedLarge) {
      messages.push("The total file limit is 100 MB. Larger projects can use a repository or drive link.");
    }
    setFileError(messages.join(" "));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
  };

  const toggleStarter = (text: string) => {
    setBookingReady(false);
    setBrief((current) => {
      const lines = current.split("\n").filter(Boolean);
      return lines.includes(text)
        ? lines.filter((line) => line !== text).join("\n")
        : [...lines, text].join("\n");
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setBookingReady(false);
    try {
      const response = await fetch("/api/co-worker/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          repo,
          brief,
          mode,
          date,
          filesCount: files.length,
          agreed,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setSubmitError(result.message || "We could not send your request. Please try again.");
        return;
      }
      setBookingReady(true);
    } catch {
      setSubmitError("We could not send your request. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectQuickDate = (weekday?: number) => {
    const selectedDate = weekday === undefined
      ? addDays(new Date(), 1)
      : getNextWeekday(weekday);
    setDate(toInputDate(selectedDate));
    setBookingReady(false);
  };

  const amountDue = mode === "later" ? ADVANCE_PRICE : TOTAL_PRICE;
  const when = mode === "later"
    ? date && (!minDate || date >= minDate) && (!maxDate || date <= maxDate)
      ? formatBookingDate(date)
      : "Choose a day"
    : "As soon as an engineer is available";

  return (
    <>
      <section
        className={styles.sharingSection}
        id="share"
        aria-labelledby="sharing-title"
      >
        <div className={styles.sharingIntro}>
          <p className={styles.eyebrow}>SHARE THE LEAST THAT HELPS</p>
          <h2 id="sharing-title">What to send, and what to keep</h2>
          <p>
            Send only what lets us do the job. We sign an NDA before opening
            anything.
          </p>
          <Link className={styles.textLink} href="/terms-and-conditions">
            Read our terms <span aria-hidden="true">↗</span>
          </Link>
          <div className={styles.privacyNote}>
            <span aria-hidden="true">⌑</span>
            <p>
              Files stay in this browser preview. Nothing is uploaded or shared
              from this page.
            </p>
          </div>
        </div>

        <div className={styles.intakeCards}>
          <div className={styles.shareChecklist}>
            <div className={styles.intakeCardHeading}>
              <span className={styles.headingIcon} aria-hidden="true">↗</span>
              <div>
                <h3>What helps us get started</h3>
                <p>A little context makes the day go further.</p>
              </div>
            </div>
            <ul className={styles.intakeList}>
              {SHARE_ITEMS.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className={styles.folderTip}>
              <strong>Sending a folder?</strong>
              <span>
                Remove <code>node_modules</code>, <code>venv</code>, and build
                folders first. Under 100 MB is ideal; for larger projects, use
                a repository or drive link.
              </span>
            </div>
          </div>

          <div className={styles.privateCard}>
            <div className={styles.intakeCardHeading}>
              <span className={`${styles.headingIcon} ${styles.privateIcon}`} aria-hidden="true">!</span>
              <div>
                <h3>Keep these private</h3>
                <p>You stay in control of access and sensitive data.</p>
              </div>
            </div>
            <ul className={`${styles.intakeList} ${styles.privateList}`}>
              {KEEP_PRIVATE_ITEMS.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">×</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.briefCard}>
            <div className={styles.intakeCardHeading}>
              <span className={`${styles.headingIcon} ${styles.briefIcon}`} aria-hidden="true">✎</span>
              <div>
                <h3>Start your brief now</h3>
                <p>Add a few details to make your day count.</p>
              </div>
            </div>

            <div
              className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ""}`}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setIsDragging(false);
                }
              }}
              onDrop={handleDrop}
            >
              <span className={styles.uploadIcon} aria-hidden="true">↑</span>
              <strong>Drop files or a folder here</strong>
              <span className={styles.dropHint}>Or choose them from your device</span>
              <div className={styles.uploadActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Add files
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => folderInputRef.current?.click()}
                >
                  Add a folder
                </button>
              </div>
              <input
                ref={fileInputRef}
                className={styles.hiddenInput}
                type="file"
                multiple
                onChange={handleFileChange}
                aria-label="Add project files"
              />
              <input
                ref={folderInputRef}
                className={styles.hiddenInput}
                type="file"
                multiple
                {...{ webkitdirectory: "", directory: "" }}
                onChange={handleFileChange}
                aria-label="Add a project folder"
              />
              {files.length > 0 && (
                <ul className={styles.fileList} aria-label="Selected files">
                  {files.map((file, index) => (
                    <li
                      key={`${getFilePath(file)}-${file.lastModified}-${index}`}
                    >
                      <span>
                        <strong title={getFilePath(file)}>
                          {getFilePath(file)}
                        </strong>
                        <small>{formatBytes(file.size)}</small>
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => {
                          setFiles((current) =>
                            current.filter((_, fileIndex) => fileIndex !== index),
                          );
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {fileError && (
                <p className={styles.fileError} role="alert">
                  {fileError}
                </p>
              )}
            </div>

            <label className={styles.fieldLabel} htmlFor="co-worker-repo">
              Repo or drive link <span>(optional)</span>
            </label>
            <input
              className={styles.textInput}
              id="co-worker-repo"
              type="url"
              placeholder="https://github.com/your-team/project"
              autoComplete="url"
              value={repo}
              onChange={(event) => {
                setRepo(event.target.value);
                setBookingReady(false);
              }}
            />

            <label className={styles.fieldLabel} htmlFor="co-worker-brief">
              What should your co-worker do?
            </label>
            <textarea
              className={styles.textarea}
              id="co-worker-brief"
              placeholder="Example: Fix the login timeout bug, add tests for the payment module, update the README."
              value={brief}
              onChange={(event) => {
                setBrief(event.target.value);
                setBookingReady(false);
              }}
            />
            <div className={styles.starterGroup} aria-label="Quick brief starters">
              {STARTERS.map((starter) => {
                const pressed = brief.split("\n").includes(starter.text);
                return (
                  <button
                    className={`${styles.starterChip} ${pressed ? styles.starterChipActive : ""}`}
                    type="button"
                    aria-pressed={pressed}
                    key={starter.label}
                    onClick={() => toggleStarter(starter.text)}
                  >
                    {starter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        className={styles.bookingSection}
        id="booking"
        aria-labelledby="booking-title"
      >
        <div className={styles.bookingIntro}>
          <p className={styles.eyebrow}>ONE DAY, TWO WAYS TO BOOK</p>
          <h2 id="booking-title">Pick how you want to book</h2>
          <p>
            Both options are for the same ₹3,480 day. Only the timing differs.
          </p>
          <div className={styles.bookingAssurance}>
            <span aria-hidden="true">✓</span>
            <p>
              An NDA is signed before work begins. You review the task list
              together before your engineer starts.
            </p>
          </div>
        </div>

        <form className={styles.bookingForm} onSubmit={handleSubmit}>
          <fieldset className={styles.bookingChoices}>
            <legend>Choose your timing</legend>
            <label
              className={`${styles.bookingChoice} ${mode === "now" ? styles.bookingChoiceActive : ""}`}
            >
              <input
                className={styles.radioInput}
                type="radio"
                name="booking-mode"
                value="now"
                checked={mode === "now"}
                onChange={() => {
                  setMode("now");
                  setBookingReady(false);
                }}
              />
              <span className={styles.radioDot} aria-hidden="true" />
              <span className={styles.choiceTag}>OPTION 1</span>
              <span className={styles.choiceTitle}>Book now</span>
              <span className={styles.choicePrice}>
                ₹3,480 <small>pay in full</small>
              </span>
              <ul>
                <li>Start as soon as an engineer is available</li>
                <li>One full working day</li>
                <li>Slot details shared after booking</li>
              </ul>
            </label>
            <label
              className={`${styles.bookingChoice} ${styles.bookingChoiceLater} ${mode === "later" ? styles.bookingChoiceActive : ""}`}
            >
              <input
                className={styles.radioInput}
                type="radio"
                name="booking-mode"
                value="later"
                checked={mode === "later"}
                onChange={() => {
                  setMode("later");
                  setBookingReady(false);
                }}
              />
              <span className={styles.radioDot} aria-hidden="true" />
              <span className={styles.choiceTag}>OPTION 2</span>
              <span className={styles.choiceTitle}>Book ahead</span>
              <span className={styles.choicePrice}>
                ₹870 <small>25% upfront</small>
              </span>
              <ul>
                <li>Reserve a date that works for you</li>
                <li>
                  Pay ₹{REMAINING_PRICE.toLocaleString("en-IN")} when you
                  confirm your slot
                </li>
                <li>Unused? Reschedule or get your advance back</li>
              </ul>
            </label>
          </fieldset>

          <div className={styles.checkoutGrid}>
            <div className={styles.bookingFields}>
              {mode === "later" && (
                <div className={styles.dateField}>
                  <label className={styles.fieldLabel} htmlFor="co-worker-date">
                    Which day?
                  </label>
                  <input
                    className={styles.textInput}
                    id="co-worker-date"
                    type="date"
                    value={date}
                    min={minDate}
                    max={maxDate}
                    required
                    onChange={(event) => {
                      setDate(event.target.value);
                      setBookingReady(false);
                    }}
                  />
                  <div
                    className={styles.dateChips}
                    role="group"
                    aria-label="Suggested dates"
                  >
                    <button type="button" onClick={() => selectQuickDate()}>
                      Tomorrow
                    </button>
                    <button type="button" onClick={() => selectQuickDate(6)}>
                      Saturday
                    </button>
                    <button type="button" onClick={() => selectQuickDate(1)}>
                      Monday
                    </button>
                  </div>
                </div>
              )}
              <label className={styles.fieldLabel} htmlFor="co-worker-email">
                Your email
              </label>
              <input
                className={styles.textInput}
                id="co-worker-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setBookingReady(false);
                }}
              />
              <p className={styles.accountHint}>
                We attach your booking to this account. Haven&apos;t registered?{" "}
                <Link href="/register">Create a free account</Link>.
              </p>
              <label className={styles.consent}>
                <input
                  type="checkbox"
                  checked={agreed}
                  required
                  onChange={(event) => {
                    setAgreed(event.target.checked);
                    setBookingReady(false);
                  }}
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms-and-conditions" target="_blank">
                    terms
                  </Link>
                  , NDA, and the refund rule shown here.
                </span>
              </label>
            </div>

            <aside className={styles.summaryCard} aria-live="polite">
              <h3>Your day summary</h3>
              <div className={styles.summaryLine}>
                <span>Co-worker day</span>
                <strong>₹3,480</strong>
              </div>
              <div className={styles.summaryLine}>
                <span>When</span>
                <strong>{when}</strong>
              </div>
              {mode === "later" && (
                <>
                  <div className={styles.summaryLine}>
                    <span>Pay later</span>
                    <strong>₹{REMAINING_PRICE.toLocaleString("en-IN")}</strong>
                  </div>
                  <p className={styles.refundNote}>
                    <strong>100% advance refund if unused.</strong> Move your
                    day to a later date or get your ₹
                    {ADVANCE_PRICE.toLocaleString("en-IN")} back in full.
                  </p>
                </>
              )}
              <div className={`${styles.summaryLine} ${styles.summaryTotal}`}>
                <span>Due at booking</span>
                <strong>₹{amountDue.toLocaleString("en-IN")}</strong>
              </div>
              <p className={styles.previewNotice}>
                Sending this request does not take payment or upload files.
              </p>
              <button
                className={styles.submitButton}
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Sending request..." : "Send booking request"}
                <span aria-hidden="true">→</span>
              </button>
            </aside>
          </div>
          {bookingReady && (
            <p className={styles.bookingStatus} role="status">
              Your request has been emailed to our team, and a receipt has been
              sent to {email}. Nothing has been booked, charged, or uploaded.
            </p>
          )}
          {submitError && (
            <p className={styles.bookingStatus} role="alert">
              {submitError}
            </p>
          )}
        </form>
      </section>
    </>
  );
}
