using System;
using System.IO;
using System.Collections.Generic;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
using System.Threading;

namespace scraper
{
    class Program
    {
        static void Main(string[] args)
        {
            string[] input = File.ReadAllLines("input1.txt");
            List<String> output = new List<String>();
            output.Add("[");
            Console.WriteLine($"Input length: {input.Length}");
            for (int i = 0; i < input.Length; i++) {
                string[] entries = input[i].Split('\t');
                output.Add("\t{");
                string formatter = $"\t\t\"port\": {entries[0]},";
                output.Add(formatter);

                string exploitNumber = ParseExploitNumber(entries[0]);
                int exploiter = int.Parse(exploitNumber);
                if (exploiter <= 200) {
                    formatter = "\t\t\"exploitable\": 1,";
                } else if (200 < exploiter && exploiter <= 400) {
                    formatter = "\t\t\"exploitable\": 2,";
                } else {
                    formatter = "\t\t\"exploitable\": 3,";
                }
                output.Add(formatter);

                formatter = $"\t\t\"desc\": \"{entries[1].ToUpper()}\",";
                output.Add(formatter);
                formatter = $"\t\t\"extended-desc\": \"{entries[2]}\",";
                output.Add(formatter);
                
                formatter = $"\t\t\"sightings\": \"" + exploitNumber + "\"";
                output.Add(formatter);

                if (i < input.Length - 1) {
                    output.Add("\t},");
                } else {
                    output.Add("\t}");
                }
            }
            output.Add("]");
            string[] file = output.ToArray();
            File.WriteAllLines("output.json", file);
            Console.WriteLine("Wrote output.json");
        }

        private static string ParseExploitNumber(string port) {
            using (var driver = new ChromeDriver()) {
                driver.Navigate().GoToUrl("https://www.exploit-db.com/search?port=" + port);
                Thread.Sleep(3000);
                string result = driver.FindElementByClassName("dataTables_info").GetAttribute("textContent");
                string[] arr = result.Split(' ');
                string exploits = arr[5].Replace(",", "");
                Console.WriteLine($"Port: {port}, number of exploits: {exploits}");
                return exploits;
            }
        }

        private static void Parse1() {
            Console.WriteLine("Parsing input1.txt");
            string[] input = File.ReadAllLines("input1.txt");
            List<String> output = new List<String>();
            for (int i = 0; i < input.Length; i++) {
                string[] entries = input[i].Split('\t');
                output.Add(entries[0]);
            }
            string[] file = output.ToArray();
            File.WriteAllLines("output1.txt", file);
            Console.WriteLine("Wrote output1.txt");
        }
    }
}
