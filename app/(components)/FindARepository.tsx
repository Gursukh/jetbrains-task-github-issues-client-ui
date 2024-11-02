"use client";

import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent,
  useContext,
} from "react";
import Link from "next/link";
import { CONSTANT_TEXT } from "../(constants)/text";
import ForkSVG from "../(assets)/fork.svg";
import StarSVG from "../(assets)/star.svg";
import { formatNumber } from "../utils";
import { RootContext } from "./RootContext";
import { RepoDetails, Status } from "../types";


export default function FindARepository(): JSX.Element {
  const { activeTab, setActiveTab, addRepository } = useContext(RootContext);
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<Status>({ text: "", isError: false });
  const [isValidURL, setIsValidURL] = useState(false);
  const [repoDetails, setRepoDetails] = useState<RepoDetails | null>(null);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // GitHub URL validation
  const validateGitHubURL = (url: string): boolean =>
    /https?:\/\/github.com\/[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+/i.test(url);

  // Fetch repository details if URL is valid
  const fetchRepoDetails = async (url: string): Promise<void> => {
    try {
      const response = await fetch(`/api/repo?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data: RepoDetails = await response.json();
        setRepoDetails(data);
        setIsValidURL(true);
        setStatus({
          text: CONSTANT_TEXT.SUCCESS_FOUND_REPOSITORY,
          isError: false,
        });
      } else {
        handleInvalidURL(CONSTANT_TEXT.ERROR_COULD_NOT_FIND_REPOSITORY);
      }
    } catch {
      handleInvalidURL("Unknown Error Occurred");
    }
  };

  // Handle invalid URLs
  const handleInvalidURL = (errorMessage: string) => {
    setIsValidURL(false);
    setStatus({ text: errorMessage, isError: true });
  };

  // Debounced input handling for URL validation
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const url = e.target.value;
    setLink(url);
    setStatus({ text: "", isError: false });

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      validateGitHubURL(url)
        ? fetchRepoDetails(url)
        : handleInvalidURL(CONSTANT_TEXT.ERROR_MALFORMED_URL);
    }, 200);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

  // Form submission handler
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (repoDetails && isValidURL) {
      addRepository(repoDetails);
      setActiveTab(repoDetails.id);
    }
  };

  return (
    <main className="flex flex-col gap-12  mx-auto max-w-[1200px] w-full">
      <h1 className="text-4xl text-center font-medium">Find A Repository</h1>
      <form className="flex flex-col items-start" onSubmit={handleSubmit}>
        <input
          placeholder="https://github.com/user/repo"
          type="url"
          className="w-full"
          value={link}
          onChange={handleInputChange}
        />
        <span
          className={`mt-2 h-4 text-sm ${
            status.isError ? "text-red-500" : "opacity-50"
          }`}
        >
          {status.text}
        </span>

        <div
          className={`transition-all duration-300 ${
            isValidURL ? " opacity-100 " : " pointer-events-none opacity-0"
          } mt-12 overflow-hidden`}
        >
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="font-bold text-4xl">{repoDetails?.name || ""}</h2>
            <p className="line-clamp-4">{repoDetails?.description || ""}</p>
            <div className="flex gap-2">
              <StarSVG width={20} height={20} />{" "}
              {formatNumber(repoDetails?.stargazers_count || 0)}
              <ForkSVG width={20} height={20} className="ml-4" />{" "}
              {formatNumber(repoDetails?.forks_count || 0)}
            </div>
          </div>
          <input
            type="submit"
            value="View Issues"
            className="mx-auto bg-primary text-white px-4 py-2 rounded-full cursor-pointer mr-4"
          />
          <Link href={repoDetails?.html_url || ""}>
            <button className="mx-auto bg-intense-background text-primary px-4 py-2 rounded-full">
              View on GitHub
            </button>
          </Link>
        </div>
      </form>
    </main>
  );
}
