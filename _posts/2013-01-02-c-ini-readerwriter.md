---
layout: post
title: C# INI Reader/Writer
date: 2013-01-02 21:42 -05:00
type: post
categories:
- Programming
tags:
- C#
---
Nothing major, just figured somebody might be able to use it. A basic INI reader/writer utility.

{% highlight csharp %}
using System.Globalization;
using System.Runtime.InteropServices;
using System.Text;
 
namespace INI
{
    public class INIReader
    {
        private readonly string _filePath;
 
        private Encoding _encoding = Encoding.ASCII;
 
        public INIReader(string filePath)
        {
            _filePath = filePath;
        }
 
        public Encoding Encoding
        {
            get { return _encoding; }
            set { _encoding = value; }
        }
 
        [DllImport("kernel32")]
        private static extern int GetPrivateProfileString(string section, string Key,
                                                          string value, StringBuilder result, int size, string filePath);
 
        public string ReadString(string section, string key, string defaultValue = null)
        {
            var temp = new StringBuilder(500);
            GetPrivateProfileString(section, key, "", temp, 500, _filePath);
            var strValue = temp.ToString();
            return string.IsNullOrEmpty(strValue) && defaultValue != null ? defaultValue : strValue;
        }
 
        public int ReadInt(string section, string key, NumberStyles style, int defaultValue = 0)
        {
            int i;
            return int.TryParse(ReadString(section, key).Replace("0x", ""), style, null, out i) ? i : defaultValue;
        }
 
        public float ReadFloat(string section, string key, float defaultValue = 0)
        {
            float f;
            return float.TryParse(ReadString(section, key), out f) ? f : defaultValue;
        }
 
        public double ReadDouble(string section, string key, double defaultValue = 0)
        {
            double d;
            return double.TryParse(ReadString(section, key), out d) ? d : defaultValue;
        }
 
        public decimal ReadDecimal(string section, string key, decimal defaultValue = 0)
        {
            decimal d;
            return decimal.TryParse(ReadString(section, key), out d) ? d : defaultValue;
        }
 
        public bool ReadBoolean(string section, string key, bool defaultValue = false)
        {
            bool b;
            return bool.TryParse(ReadString(section, key), out b) ? b : defaultValue;
        }
    }
 
    public class INIWriter
    {
        private readonly string _filePath;
 
        public INIWriter(string filePath)
        {
            _filePath = filePath;
        }
 
        [DllImport("kernel32")]
        private static extern long WritePrivateProfileString(string section, string key,
                                                             string val, string filePath);
 
        public void WriteString(string section, string key, string value, string comment = null)
        {
            var concatValue = comment != null ? string.Format("{0} ; {1}", value, comment) : value;
            WritePrivateProfileString(section, key, concatValue, _filePath);
        }
 
        public void WriteInt(string section, string key, int value, string comment = null)
        {
            WriteString(section, key, value.ToString(), comment);
        }
 
        public void WriteFloat(string section, string key, float value, string comment = null)
        {
            WriteString(section, key, value.ToString(), comment);
        }
 
        public void WriteDouble(string section, string key, double value, string comment = null)
        {
            WriteString(section, key, value.ToString(), comment);
        }
 
        public void WriteDecimal(string section, string key, decimal value, string comment = null)
        {
            WriteString(section, key, value.ToString(), comment);
        }
 
        public void WriteBoolean(string section, string key, bool value, bool useNumeric = false, string comment = null)
        {
            if (useNumeric)
                WriteString(section, key, value ? "1" : "0", comment);
            else
                WriteString(section, key, value.ToString(), comment);
        }
    }
}
{% endhighlight %}