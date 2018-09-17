---
layout: post
title: C# - Global Hotkeys via GetAsyncKeyState
date: 2013-10-13 16:44 -04:00
description: Global hotkeys in C# via GetAsyncGetState
type: post
categories:
- C#
- Programming
tags:
- C#
- GetAsyncKeyState
- RegisterHotKey
---

Here's a quick little class for implementing global hotkeys in C#/.NET 2.0+.

As a bit of a preface, you could easily use [RegisterHotKey](http://msdn.microsoft.com/en-us/library/windows/desktop/ms646309(v=vs.85).aspx) and [UnregisterHotKey](http://msdn.microsoft.com/en-us/library/windows/desktop/ms646327(v=vs.85).aspx) respectively to accomplish something like this, but this has a few caveats:

* You can't register a key that has already been previously registered.
* Some keys are reserved and cannot be registered, such as F12.
* Although hacks exist, it's not very ideal to easily implement with console applications due to the lack of a proper window handle.

Alternatively, we can use another WinAPI function: [GetAsyncKeyState](http://msdn.microsoft.com/en-us/library/windows/desktop/ms646293(v=vs.85).aspx). It requires a bit more manual work, but it's simple in the end.

**Note: Without getting into semantics about what constitutes a proper "hook", I'm just going to refer to the process of monitoring/polling key events via GetAsyncKeyState() as "hooking".**

To keep things simple, the actually hooking process will use the [Keys Enumeration](http://msdn.microsoft.com/en-us/library/system.windows.forms.keys.aspx) and will marshall their underlying integral type during the P/Invoke. When a key is pressed, we will trigger the KeyPressed event.

#### Modifier Keys
We don't want to limit the hooking to just basic keys, instead will allow optional modifier keys using the ModifierKeys enum.

{% highlight csharp %}
[Flags]
public enum ModifierKeys : uint
{
    None = 0,
    Alt = 1,
    Control = 2,
    Shift = 4,
}
{% endhighlight %}

#### Hooking & Unhooking
To hook a key, call the Hook() method, supplying the Keys value as well as any optional modifier keys. Additionally, you can provide a delegate to use for a callback for when the key is pressed.

To unhook a key, simple call the Unhook() method with the appropriate parameters and it will no longer be polled.

{% highlight csharp %}
[Flags]
var keyboard = new KeyboardHook();
keyboard.Hook(Keys.PrintScreen);
 
// do something
 
keyboard.Unhook(Keys.PrintScreen);
{% endhighlight %}

Internally, the hooked keys will be stored as KeyHook objects, which provide Keys and Modifiers properties.

{% highlight csharp %}
private class KeyHook
{
    public KeyHook(Keys key, ModifierKeys modifiers, KeyHookDelegate pressed = null)
    {
        Key = key;
        Modifiers = modifiers;
        Pressed = pressed;
    }
 
    public Keys Key { get; private set; }
    public ModifierKeys Modifiers { get; private set; }
    public KeyHookDelegate Pressed { get; private set; }
}
{% endhighlight %}

#### Prioritization

For simple hotkeys, there won't be any collisions. However, when you start mixing and matching modifier keys, things can get a little messy. To alleviate this issue, the hooked keys are sorted internally using a custom [IComparer&lt;T&gt;](http://msdn.microsoft.com/en-us/library/8ehhxeaf.aspx):

{% highlight csharp %}
private class HookComparer : IComparer<KeyHook>
{
    private static int GetModifierCount(ModifierKeys modifiers)
    {
        var iValue = (int) modifiers;
        var bitCount = 0;
 
        while (iValue != 0)
        {
            iValue = iValue & (iValue - 1);
            bitCount++;
        }
 
        return bitCount;
    }
 
    #region Implementation of IComparer<KeyHook>
 
    public int Compare(KeyHook x, KeyHook y)
    {
        var keyCompare = x.Key.CompareTo(y.Key);
        if (keyCompare != 0)
            return keyCompare;
 
        var modifierCount = GetModifierCount(y.Modifiers).CompareTo(GetModifierCount(x.Modifiers));
        if (modifierCount != 0)
            return modifierCount;
 
        return ((int) x.Modifiers).CompareTo((int) y.Modifiers);
    }
 
    #endregion
}
{% endhighlight %}

Basically, it just compares hooked keys based on the following:

1. [Keys](http://msdn.microsoft.com/en-us/library/system.windows.forms.keys.aspx) enumeration
2. Number of ModiferKeys set
3. Underlying ModifierKeys integral type summation

To sort the list, we use a simple lambda expression with our comparer:

{% highlight csharp %}
_keys.Sort((k1, k2) => new HookComparer().Compare(k1, k2));
{% endhighlight %}

#### Polling
The underlying polling is based on a [SystemTimer.Timer](http://msdn.microsoft.com/en-us/library/system.timers.timer.aspx). According to [official Microsoft sources](http://msdn.microsoft.com/en-us/windows/hardware/gg463266.aspx), this has a resolution of 15.6ms:

> The default timer resolution on Windows 7 is 15.6 milliseconds (ms). Some applications reduce this to 1 ms, which reduces the battery run time on mobile systems by as much as 25 percent.

I'm not about to perform a case steady on how fast a human can realistically type versus the timer interval, configure the interval as necessary. The polling itself can be enabled/disabled via the Enabled property. Additionally, polling is suppressed when hooking/unhooking keys.
During each tick, the key states are polled via PollKeyStates():

{% highlight csharp %}
private void PollKeyStates()
{
    var altPressed = Convert.ToBoolean(GetAsyncKeyState(Keys.Menu));
    var controlPressed = Convert.ToBoolean(GetAsyncKeyState(Keys.ControlKey));
    var shiftPressed = Convert.ToBoolean(GetAsyncKeyState(Keys.ShiftKey));
 
    var pressedKeys = new List<Keys>();
 
    foreach (var key in _keys)
    {
        if ((GetAsyncKeyState(key.Key) == -32767))
            pressedKeys.Add(key.Key);
    }
 
    foreach (var key in _keys)
    {
        if (!pressedKeys.Contains(key.Key))
            continue;
 
        if ((key.Modifiers & ModifierKeys.None) == ModifierKeys.None)
        {
            if ((key.Modifiers & ModifierKeys.Alt) == ModifierKeys.Alt && !altPressed)
                continue;
            if ((key.Modifiers & ModifierKeys.Control) == ModifierKeys.Control && !controlPressed)
                continue;
            if ((key.Modifiers & ModifierKeys.Shift) == ModifierKeys.Shift && !shiftPressed)
                continue;
        }
 
        pressedKeys.Remove(key.Key);
 
        if (KeyPressed != null)
            KeyPressed(this, new KeyPressedEventArgs(key.Modifiers, key.Key));
 
        if (key.Pressed != null)
            key.Pressed(this, EventArgs.Empty);
    }
}
{% endhighlight %}

When using GetAsyncKeyState() you need to pay attention to the most and least significant bits:

> If the function succeeds, the return value specifies whether the key was pressed since the last call to GetAsyncKeyState, and whether the key is currently up or down. If the most significant bit is set, the key is down, and if the least significant bit is set, the key was pressed after the previous call to GetAsyncKeyState. However, you should not rely on this last behavior.

Normally when polling like these, we would end up triggering multiple KeyPressed events within a few milliseconds apart from each other. We can use the return value to get around this.

A temporary List<Keys> is created which contains all hooked keys which are currently pressed. This way we don't need to call GetAsyncKeyState() while iterating over the hooked keys and we can prevent hook collisions. This is where the key sorting from earlier comes into play. We don't want to prematurely trigger a KeyPressed event for a different hooked key than expected.

This isn't necessarily a perfect solution but it works and is simple and flexible.

Finally, here's the complete class:

{% highlight csharp %}
/*
* KeyboardHook.cs by Nate Shoffner
* http://nateshoffner.com
*/
 
#region
 
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Timers;
using System.Windows.Forms;
using Timer = System.Timers.Timer;
 
#endregion
 
namespace GlobalHotkeys
{
    [Flags]
    public enum ModifierKeys : uint
    {
        None = 0,
        Alt = 1,
        Control = 2,
        Shift = 4,
    }
 
    public class KeyPressedEventArgs : EventArgs
    {
        internal KeyPressedEventArgs(ModifierKeys modifiers, Keys key)
        {
            Modifiers = modifiers;
            Key = key;
        }
 
        public Keys Key { get; private set; }
        public ModifierKeys Modifiers { get; private set; }
    }
 
    public class KeyboardHook : IDisposable
    {
        #region P/Invokes
 
        [DllImport("user32.dll")]
        private static extern short GetAsyncKeyState(Keys vKey);
 
        #endregion
 
        #region Delegates
 
        public delegate void KeyHookDelegate(object sender, EventArgs e);
 
        #endregion
 
        private readonly List<KeyHook> _keys = new List<KeyHook>();
        private readonly Timer _timer;
 
        public KeyboardHook()
        {
            _timer = new Timer {Interval = 75};
            _timer.Elapsed += _timer_Elapsed;
        }
 
        public bool Enabled
        {
            get { return _timer.Enabled; }
 
            set
            {
                if (value)
                    _timer.Start();
                else
                    _timer.Stop();
            }
        }
 
        public event EventHandler<KeyPressedEventArgs> KeyPressed;
 
        public bool Hook(Keys key, ModifierKeys modifiers = ModifierKeys.None, KeyHookDelegate pressed = null)
        {
            if (_timer.Enabled)
                _timer.Stop();
 
            var exists = _keys.Find(x => x.Key == key && x.Modifiers == modifiers) != null;
 
            if (!exists)
            {
                _keys.Add(new KeyHook(key, modifiers, pressed));
                _keys.Sort((k1, k2) => new HookComparer().Compare(k1, k2));
            }
 
            if (_keys.Count > 0)
                _timer.Start();
 
            return !exists;
        }
 
        public bool Unhook(Keys key, ModifierKeys modifiers = ModifierKeys.None)
        {
            if (_timer.Enabled)
                _timer.Stop();
 
            var i = _keys.FindIndex(x => x.Key == key && x.Modifiers == modifiers);
 
            if (i >= 0)
            {
                _keys.RemoveAt(i);
                return true;
            }
 
            if (_keys.Count > 0)
                _timer.Start();
 
            return false;
        }
 
        private void _timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            PollKeyStates();
        }
 
        private void PollKeyStates()
        {
            var altPressed = Convert.ToBoolean(GetAsyncKeyState(Keys.Menu));
            var controlPressed = Convert.ToBoolean(GetAsyncKeyState(Keys.ControlKey));
            var shiftPressed = Convert.ToBoolean(GetAsyncKeyState(Keys.ShiftKey));
 
            var pressedKeys = new List<Keys>();
 
            foreach (var key in _keys)
            {
                if ((GetAsyncKeyState(key.Key) == -32767))
                    pressedKeys.Add(key.Key);
            }
 
            foreach (var key in _keys)
            {
                if (!pressedKeys.Contains(key.Key))
                    continue;
 
                if ((key.Modifiers & ModifierKeys.None) == ModifierKeys.None)
                {
                    if ((key.Modifiers & ModifierKeys.Alt) == ModifierKeys.Alt && !altPressed)
                        continue;
                    if ((key.Modifiers & ModifierKeys.Control) == ModifierKeys.Control && !controlPressed)
                        continue;
                    if ((key.Modifiers & ModifierKeys.Shift) == ModifierKeys.Shift && !shiftPressed)
                        continue;
                }
 
                pressedKeys.Remove(key.Key);
 
                if (KeyPressed != null)
                    KeyPressed(this, new KeyPressedEventArgs(key.Modifiers, key.Key));
            }
        }
 
        #region Nested type: HookComparer
 
        private class HookComparer : IComparer<KeyHook>
        {
            private static int GetModifierCount(ModifierKeys modifiers)
            {
                var iValue = (int) modifiers;
                var bitCount = 0;
 
                while (iValue != 0)
                {
                    iValue = iValue & (iValue - 1);
                    bitCount++;
                }
 
                return bitCount;
            }
 
            #region Implementation of IComparer<KeyHook>
 
            public int Compare(KeyHook x, KeyHook y)
            {
                var keyCompare = x.Key.CompareTo(y.Key);
                if (keyCompare != 0)
                    return keyCompare;
 
                var modifierCount = GetModifierCount(y.Modifiers).CompareTo(GetModifierCount(x.Modifiers));
                if (modifierCount != 0)
                    return modifierCount;
 
                return ((int) x.Modifiers).CompareTo((int) y.Modifiers);
            }
 
            #endregion
        }
 
        #endregion
 
        #region Implementation of IDisposable
 
        public void Dispose()
        {
            _timer.Stop();
            _timer.Dispose();
        }
 
        #endregion
 
        #region Nested type: KeyHook
 
        private class KeyHook
        {
            public KeyHook(Keys key, ModifierKeys modifiers)
            {
                Key = key;
                Modifiers = modifiers;
            }
 
            public Keys Key { get; private set; }
            public ModifierKeys Modifiers { get; private set; }
        }
 
        #endregion
    }
}
{% endhighlight %}