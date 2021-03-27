using System;
using System.IO;
using System.Collections.Generic;

namespace parser
{
    class Program
    {
        static void Main(string[] args)
        {
            // https://web.mit.edu/rhel-doc/4/RH-DOCS/rhel-sg-en-4/ch-ports.html
            // copy table -> input.txt -> dotnet run -> output.json
            Console.WriteLine("Parsing input.txt");
            string[] input = File.ReadAllLines("input.txt");
            List<String> output = new List<String>();
            output.Add("[");
            for (int i = 0; i < input.Length; i++) {
                string[] entries = input[i].Split('\t');
                output.Add("\t{");
                string formatter = $"\t\t\"port\": {entries[0]},";
                output.Add(formatter);
                formatter = "\t\t\"exploitable\": 1,";
                output.Add(formatter);
                formatter = $"\t\t\"desc\": \"{entries[1].ToUpper()}\",";
                output.Add(formatter);
                formatter = $"\t\t\"extended-desc\": \"{entries[2]}\",";
                output.Add(formatter);
                output.Add("\t\t\"sightings\": \"\"");
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
    }
}
